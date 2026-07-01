import fs from "node:fs";
import path from "node:path";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";
import cloudinary from "../config/cloudinary";
import { env } from "../config/env";

export async function saveToDisk(buffer: Buffer, category: string, extension: string): Promise<string> {
  const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR, category);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filename = `extracted-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
  const filePath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  
  const relativeUrl = `/uploads/${category}/${filename}`;
  if (env.BACKEND_BASE_URL) {
    return `${env.BACKEND_BASE_URL.replace(/\/$/, "")}${relativeUrl}`;
  }
  return relativeUrl;
}

export async function uploadImageBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  const extension = mimeType === "image/jpeg" ? ".jpg" : mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".png";
  
  if (env.CLOUDINARY_CLOUD_NAME) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ibtwebsite/blogs",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || result?.url || "");
        }
      );
      uploadStream.end(buffer);
    });
  } else {
    return saveToDisk(buffer, "blogs", extension);
  }
}

export async function parseDocx(buffer: Buffer): Promise<{ html: string; warnings: string[] }> {
  const warnings: string[] = [];
  
  const options = {
    styleMap: [
      "u => u",
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Heading 4'] => h4:fresh",
      "p[style-name='Heading 5'] => h5:fresh",
      "p[style-name='Heading 6'] => h6:fresh",
      "p[style-name='List Bullet'] => ul > li:fresh",
      "p[style-name='List Number'] => ol > li:fresh",
      "p[style-name='Normal'] => p:fresh",
    ],
    convertImage: mammoth.images.imgElement(async (image) => {
      const imgBuffer = await image.read();
      const mimeType = image.contentType;
      
      try {
        const url = await uploadImageBuffer(imgBuffer, mimeType);
        return {
          src: url
        };
      } catch (err: any) {
        warnings.push(`Failed to upload extracted image: ${err.message}`);
        const base64 = imgBuffer.toString("base64");
        return {
          src: `data:${mimeType};base64,${base64}`
        };
      }
    })
  };
  
  const result = await mammoth.convertToHtml({ buffer }, options);
  
  if (result.messages && result.messages.length > 0) {
    result.messages.forEach((w: any) => warnings.push(w.message));
  }
  
  return {
    html: result.value,
    warnings
  };
}

interface PdfElement {
  type: "text" | "image";
  tx: number;
  ty: number;
  width: number;
  height: number;
  str?: string;
  fontSize?: number;
  fontName?: string;
  src?: string;
}

interface ProcessedLine {
  type: "text" | "image" | "heading" | "list" | "table-row";
  tag: string;
  html: string;
  fontSize: number;
  ty: number;
  tx: number;
  isHeading: boolean;
  isList: boolean;
  cells?: string[];
}

function multiplyMatrices(m1: number[], m2: number[]) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

export async function parsePdf(buffer: Buffer): Promise<{ html: string; warnings: string[] }> {
  const warnings: string[] = [];
  let htmlResult = "";
  
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    });
    
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    
    let allDocElements: { pageNum: number; elements: PdfElement[] }[] = [];
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const opList = await page.getOperatorList();
      
      const textItems = textContent.items.filter((item: any) => item.str && item.str.trim().length > 0);
      
      const images: any[] = [];
      let ctm = [1, 0, 0, 1, 0, 0];
      const ctmStack: number[][] = [];
      
      for (let i = 0; i < opList.fnArray.length; i++) {
        const fn = opList.fnArray[i];
        const args = opList.argsArray[i];
        
        if (fn === pdfjsLib.OPS.save) {
          ctmStack.push([...ctm]);
        } else if (fn === pdfjsLib.OPS.restore) {
          if (ctmStack.length > 0) {
            ctm = ctmStack.pop()!;
          }
        } else if (fn === pdfjsLib.OPS.transform) {
          ctm = multiplyMatrices(ctm, args);
        } else if (fn === pdfjsLib.OPS.paintImageXObject) {
          const imgName = args[0];
          let imgObj: any = null;
          try {
            imgObj = page.objs.get(imgName) || page.commonObjs.get(imgName);
          } catch (e) {
            // Ignore
          }
          
          if (imgObj) {
            const scaleX = Math.sqrt(ctm[0] * ctm[0] + ctm[1] * ctm[1]);
            const scaleY = Math.sqrt(ctm[2] * ctm[2] + ctm[3] * ctm[3]);
            images.push({
              imgObj,
              tx: ctm[4],
              ty: ctm[5],
              width: scaleX,
              height: scaleY,
            });
          }
        }
      }
      
      const elements: PdfElement[] = [];
      
      for (const item of textItems as any[]) {
        const transform = item.transform;
        const fontSize = Math.abs(transform[3]);
        elements.push({
          type: "text",
          tx: transform[4],
          ty: transform[5],
          width: item.width,
          height: item.height || fontSize,
          str: item.str,
          fontSize,
          fontName: item.fontName,
        });
      }
      
      for (const img of images) {
        try {
          const { imgObj, tx, ty, width, height } = img;
          const channels = Math.round(imgObj.data.length / (imgObj.width * imgObj.height));
          let imgBuffer = Buffer.from(imgObj.data.buffer || imgObj.data);
          if (imgObj.data.byteOffset !== 0 || imgObj.data.byteLength !== imgObj.data.buffer.byteLength) {
            imgBuffer = Buffer.from(imgObj.data.buffer, imgObj.data.byteOffset, imgObj.data.byteLength);
          }
          
          const processedBuffer = await sharp(imgBuffer, {
            raw: {
              width: imgObj.width,
              height: imgObj.height,
              channels: (channels === 3 || channels === 4 || channels === 1 ? channels : 4) as 1 | 3 | 4,
            },
          })
          .png()
          .toBuffer();
          
          const url = await uploadImageBuffer(processedBuffer, "image/png");
          elements.push({
            type: "image",
            tx,
            ty,
            width,
            height,
            src: url,
          });
        } catch (err: any) {
          warnings.push(`Failed to extract image on page ${pageNum}: ${err.message}`);
        }
      }
      
      elements.sort((a, b) => {
        const yDiff = b.ty - a.ty;
        if (Math.abs(yDiff) > 5) {
          return yDiff;
        }
        return a.tx - b.tx;
      });
      
      allDocElements.push({ pageNum, elements });
    }
    
    let docHtml = "";
    
    for (const pageData of allDocElements) {
      const { pageNum, elements } = pageData;
      if (elements.length === 0) continue;
      
      const lines: PdfElement[][] = [];
      for (const el of elements) {
        let placed = false;
        for (const line of lines) {
          const avgTy = line.reduce((sum, item) => sum + item.ty, 0) / line.length;
          const threshold = Math.max(5, (el.fontSize || 10) * 0.6);
          if (Math.abs(el.ty - avgTy) < threshold) {
            line.push(el);
            placed = true;
            break;
          }
        }
        if (!placed) {
          lines.push([el]);
        }
      }
      
      lines.sort((a, b) => {
        const avgA = a.reduce((sum, item) => sum + item.ty, 0) / a.length;
        const avgB = b.reduce((sum, item) => sum + item.ty, 0) / b.length;
        return avgB - avgA;
      });
      
      for (const line of lines) {
        line.sort((a, b) => a.tx - b.tx);
      }
      
      const allFontSizes = elements.filter((el) => el.type === "text").map((el) => el.fontSize || 10);
      allFontSizes.sort((a, b) => a - b);
      const medianFontSize = allFontSizes.length > 0 ? allFontSizes[Math.floor(allFontSizes.length / 2)] : 11;
      
      const processedLines: ProcessedLine[] = [];
      
      for (const line of lines) {
        const textElementsInLine = line.filter((el) => el.type === "text");
        const imageElementsInLine = line.filter((el) => el.type === "image");
        
        if (textElementsInLine.length === 0 && imageElementsInLine.length > 0) {
          for (const img of imageElementsInLine) {
            processedLines.push({
              type: "image",
              tag: "div",
              html: `<img src="${img.src}" style="max-width: 100%; height: auto;" width="${Math.round(img.width)}" height="${Math.round(img.height)}" />`,
              fontSize: 0,
              ty: img.ty,
              tx: img.tx,
              isHeading: false,
              isList: false,
            });
          }
          continue;
        }
        
        let lineHtml = "";
        let maxFontSize = 0;
        let totalFontSize = 0;
        let textCount = 0;
        const firstEl = line[0];
        
        const cells: string[] = [];
        let currentCellHtml = "";
        
        for (let j = 0; j < line.length; j++) {
          const el = line[j];
          if (el.type === "image") {
            const imgHtml = `<img src="${el.src}" style="max-width: 100%; height: auto; display: inline-block; vertical-align: middle; margin: 5px;" width="${Math.round(el.width)}" height="${Math.round(el.height)}" />`;
            lineHtml += imgHtml;
            currentCellHtml += imgHtml;
          } else {
            let str = el.str || "";
            maxFontSize = Math.max(maxFontSize, el.fontSize || 10);
            totalFontSize += el.fontSize || 10;
            textCount++;
            
            const isBold = /bold/i.test(el.fontName || "") || /black/i.test(el.fontName || "") || /heavy/i.test(el.fontName || "");
            const isItalic = /italic/i.test(el.fontName || "") || /oblique/i.test(el.fontName || "");
            
            str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            
            if (isBold) str = `<strong>${str}</strong>`;
            if (isItalic) str = `<em>${str}</em>`;
            
            lineHtml += str;
            currentCellHtml += str;
            
            const nextEl = line[j + 1];
            if (nextEl) {
              const gap = nextEl.tx - (el.tx + el.width);
              if (gap > 55) {
                cells.push(currentCellHtml.trim());
                currentCellHtml = "";
              } else {
                const currentStr = el.str || "";
                const nextStr = nextEl.str || "";
                const hasSpace = currentStr.endsWith(" ") || nextStr.startsWith(" ");
                if (!hasSpace) {
                  const spaceThreshold = Math.max(1.5, (el.fontSize || 10) * 0.15);
                  if (gap >= spaceThreshold) {
                    lineHtml += " ";
                    currentCellHtml += " ";
                  }
                }
              }
            }
          }
        }
        
        if (currentCellHtml.trim().length > 0) {
          cells.push(currentCellHtml.trim());
        }
        
        const avgFontSize = textCount > 0 ? totalFontSize / textCount : medianFontSize;
        const lineText = lineHtml.replace(/<[^>]*>/g, "").trim();
        
        let tag = "p";
        let isHeading = false;
        const isBold = line.some(el => el.type === "text" && (/bold/i.test(el.fontName || "") || /black/i.test(el.fontName || "") || /heavy/i.test(el.fontName || "")));
        if (lineText.length > 0 && lineText.length < 120) {
          if (avgFontSize >= medianFontSize * 1.5) {
            tag = "h1";
            isHeading = true;
          } else if (avgFontSize >= medianFontSize * 1.3) {
            tag = "h2";
            isHeading = true;
          } else if (avgFontSize >= medianFontSize * 1.15) {
            tag = "h3";
            isHeading = true;
          } else if (avgFontSize >= medianFontSize * 1.05 && (isBold || avgFontSize > medianFontSize + 1)) {
            tag = "h4";
            isHeading = true;
          }
        }
        
        let isList = false;
        const bulletRegex = /^([•\-*]|(\d+|[a-zA-Z])\.)\s+/;
        if (tag === "p" && bulletRegex.test(lineText)) {
          tag = "li";
          isList = true;
          lineHtml = lineHtml.replace(bulletRegex, "");
        }
        
        processedLines.push({
          type: cells.length >= 2 ? "table-row" : isHeading ? "heading" : isList ? "list" : "text",
          tag,
          html: lineHtml,
          fontSize: avgFontSize,
          ty: firstEl.ty,
          tx: firstEl.tx,
          isHeading,
          isList,
          cells,
        });
      }
      
      let i = 0;
      let pageHtml = "";
      
      while (i < processedLines.length) {
        const currentLine = processedLines[i];
        
        if (currentLine.type === "image") {
          pageHtml += `<div style="text-align: center; margin: 1.5rem 0;">${currentLine.html}</div>`;
          i++;
        } else if (currentLine.type === "table-row") {
          let count = 0;
          while (i + count < processedLines.length && processedLines[i + count].type === "table-row") {
            count++;
          }
          
          if (count >= 2) {
            pageHtml += `<div style="overflow-x: auto; margin: 1.5rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; font-size: 0.875rem;">`;
            while (i < processedLines.length && processedLines[i].type === "table-row") {
              const row = processedLines[i];
              pageHtml += `<tr>`;
              if (row.cells) {
                for (const cell of row.cells) {
                  pageHtml += `<td style="border: 1px solid #e5e7eb; padding: 10px; vertical-align: top; text-align: left;">${cell}</td>`;
                }
              }
              pageHtml += `</tr>`;
              i++;
            }
            pageHtml += `</table></div>`;
          } else {
            const joinedText = currentLine.cells ? currentLine.cells.join(" &nbsp; &nbsp; ") : currentLine.html;
            pageHtml += `<p>${joinedText}</p>`;
            i++;
          }
        } else if (currentLine.isHeading) {
          pageHtml += `<${currentLine.tag}>${currentLine.html}</${currentLine.tag}>`;
          i++;
        } else if (currentLine.isList) {
          const listItems: ProcessedLine[] = [];
          const originalBullet = currentLine.html.match(/^(\d+|[a-zA-Z])\./);
          const isOrdered = !!originalBullet;
          
          while (i < processedLines.length && processedLines[i].isList) {
            listItems.push(processedLines[i]);
            i++;
          }
          
          const listTag = isOrdered ? "ol" : "ul";
          pageHtml += `<${listTag}>`;
          for (const li of listItems) {
            pageHtml += `<li>${li.html}</li>`;
          }
          pageHtml += `</${listTag}>`;
        } else {
          let paraHtml = currentLine.html;
          let currentTy = currentLine.ty;
          let currentFontSize = currentLine.fontSize;
          i++;
          
          while (
            i < processedLines.length &&
            processedLines[i].type === "text" &&
            !processedLines[i].isHeading &&
            !processedLines[i].isList
          ) {
            const nextLine = processedLines[i];
            const gap = Math.abs(currentTy - nextLine.ty);
            const threshold = Math.max(16, currentFontSize * 1.6);
            
            if (gap < threshold) {
              const hasSpace = paraHtml.endsWith(" ") || nextLine.html.startsWith(" ");
              paraHtml += (hasSpace ? "" : " ") + nextLine.html;
              currentTy = nextLine.ty;
              currentFontSize = nextLine.fontSize;
              i++;
            } else {
              break;
            }
          }
          
          if (paraHtml.trim().length > 0) {
            pageHtml += `<p>${paraHtml}</p>`;
          }
        }
      }
      
      docHtml += pageHtml;
    }
    
    htmlResult = docHtml;
  } catch (err: any) {
    throw new Error(`Failed to parse PDF document: ${err.message}`);
  }
  
  return {
    html: htmlResult,
    warnings,
  };
}
