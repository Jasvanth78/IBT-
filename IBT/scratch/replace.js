const fs = require('fs');
const p = 'd:/Projects Folder/IBT/ibt-website/IBT/src/features/products/components/AllProductsPage.tsx';
let c = fs.readFileSync(p, 'utf8');
const m = {
  'PRODUCTS_HERO_TITLE': 'productsHeroTitle',
  'PRODUCTS_HERO_HIGHLIGHT': 'productsHeroHighlight',
  'PRODUCTS_HERO_DESCRIPTION': 'productsHeroDescription',
  'PRODUCTS_HERO_IMAGE_URL': 'productsHeroImageUrl',
  'PRODUCTS_HERO_PROJECTS_DELIVERED': 'productsHeroProjectsDelivered',
  'PRODUCTS_HERO_CLIENT_SATISFACTION': 'productsHeroClientSatisfaction',
  'PRODUCTS_MICRO_APPS_TITLE': 'productsMicroAppsTitle',
  'PRODUCTS_MICRO_APPS_SUBTITLE': 'productsMicroAppsSubtitle',
  'PRODUCTS_MICRO_APPS_LEFT_INTRO': 'productsMicroAppsLeftIntro',
  'PRODUCTS_MICRO_APPS_LEFT_HEADING': 'productsMicroAppsLeftHeading',
  'PRODUCTS_MICRO_APPS_LEFT_TEXT': 'productsMicroAppsLeftText',
  'PRODUCTS_MICRO_APPS_LEFT_BULLETS': 'productsMicroAppsLeftBullets',
  'PRODUCTS_MICRO_APPS_RIGHT_TEXT_TOP': 'productsMicroAppsRightTextTop',
  'PRODUCTS_MICRO_APPS_RIGHT_HEADING': 'productsMicroAppsRightHeading',
  'PRODUCTS_MICRO_APPS_RIGHT_BULLETS': 'productsMicroAppsRightBullets',
  'PRODUCTS_MICRO_APPS_RIGHT_TEXT_BOTTOM': 'productsMicroAppsRightTextBottom'
};
for (const [k, v] of Object.entries(m)) {
  c = c.split('settings.' + k).join('settings.' + v);
}
fs.writeFileSync(p, c);
