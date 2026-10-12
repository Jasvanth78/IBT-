import { AuditAction, BranchType } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { httpError } from "../utils/httpError";
import { logAction } from "../utils/logAction";


type CreateBranchInput = {
  name: string;
  location: string;
  address?: string;
  mapUrl?: string;
  type: BranchType;
  order?: number;
};

type UpdateBranchInput = Partial<CreateBranchInput>;

type ListBranchFilters = {
  search?: string;
  type?: BranchType;
  page?: number;
  limit?: number;
};

type AssignMemberInput = {
  memberId: string;
  order?: number;
};

type ListBranchMemberFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const mapKnownPrismaError = (error: unknown): Error => {
  const err = error as { code?: string; meta?: { target?: string[] } };

  if (err?.code === "P2002") {
    const target = err.meta?.target?.join(", ") || "unique field";
    return httpError(409, `A branch already exists for unique field: ${target}`);
  }

  return error instanceof Error ? error : new Error("Unexpected database error");
};

const ensureBranchExists = async (branchId: string) => {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });

  if (!branch) {
    throw httpError(404, "Branch not found");
  }

  return branch;
};

const ensureMemberExists = async (memberId: string) => {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) {
    throw httpError(404, "Member not found");
  }

  return member;
};

const ensureAssignmentExists = async (branchId: string, memberId: string) => {
  const assignment = await prisma.branchMember.findFirst({
    where: { branchId, memberId },
  });

  if (!assignment) {
    throw httpError(404, "Branch member assignment not found");
  }

  return assignment;
};

export const createBranch = async (input: CreateBranchInput, userId?: string) => {
  const totalBranches = await prisma.branch.count();
  const desiredOrder = clamp(input.order ?? totalBranches + 1, 1, totalBranches + 1);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const affected = await tx.branch.findMany({
        where: {
          order: { gte: desiredOrder },
        },
        orderBy: {
          order: "desc",
        },
      });

      for (const item of affected) {
        await tx.branch.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }

      return tx.branch.create({
        data: {
          name: input.name,
          location: input.location,
          address: input.address,
          mapUrl: input.mapUrl,
          type: input.type,
          order: desiredOrder,
        },
      });
    });

    await logAction({
      userId,
      action: AuditAction.CREATE,
      entity: "Branch",
      entityId: created.id,
      newData: {
        id: created.id,
        name: created.name,
        type: created.type,
        order: created.order,
      },
    });

    return created;
  } catch (error) {
    throw mapKnownPrismaError(error);
  }
};

export const getAllBranches = async (filters: ListBranchFilters) => {
  const shouldPaginate = filters.page !== undefined && filters.limit !== undefined;
  const skip = shouldPaginate ? (filters.page! - 1) * filters.limit! : undefined;
  const take = shouldPaginate ? filters.limit : undefined;

  const where = {
    name: filters.search
      ? {
          contains: filters.search,
          mode: "insensitive" as const,
        }
      : undefined,
    type: filters.type,
  };

  if (!shouldPaginate) {
    return prisma.branch.findMany({
      where,
      select: {
        id: true,
        name: true,
        location: true,
        type: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { teamMembers: true },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }

  const [items, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      select: {
        id: true,
        name: true,
        location: true,
        type: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { teamMembers: true },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      skip,
      take,
    }),
    prisma.branch.count({ where }),
  ]);

  const page = filters.page!;
  const limit = filters.limit!;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const getBranchById = async (branchId: string) => {
  await ensureBranchExists(branchId);

  return prisma.branch.findUniqueOrThrow({
    where: { id: branchId },
    select: {
      id: true,
      name: true,
      location: true,
      type: true,
      order: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { teamMembers: true },
      },
    },
  });
};

export const updateBranch = async (
  branchId: string,
  input: UpdateBranchInput,
  userId?: string
) => {
  const existing = await ensureBranchExists(branchId);
  const totalBranches = await prisma.branch.count();
  const targetOrder =
    input.order !== undefined
      ? clamp(input.order, 1, totalBranches)
      : existing.order;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (targetOrder === existing.order) {
        return tx.branch.update({
          where: { id: branchId },
          data: {
            name: input.name,
            location: input.location,
            address: input.address,
            mapUrl: input.mapUrl,
            type: input.type,
            order: targetOrder,
          },
        });
      }

      await tx.branch.update({
        where: { id: branchId },
        data: { order: 0 },
      });

      if (targetOrder < existing.order) {
        const affected = await tx.branch.findMany({
          where: {
            id: { not: branchId },
            order: {
              gte: targetOrder,
              lt: existing.order,
            },
          },
          orderBy: {
            order: "desc",
          },
        });

        for (const item of affected) {
          await tx.branch.update({
            where: { id: item.id },
            data: { order: item.order + 1 },
          });
        }
      }

      if (targetOrder > existing.order) {
        const affected = await tx.branch.findMany({
          where: {
            id: { not: branchId },
            order: {
              gt: existing.order,
              lte: targetOrder,
            },
          },
          orderBy: {
            order: "asc",
          },
        });

        for (const item of affected) {
          await tx.branch.update({
            where: { id: item.id },
            data: { order: item.order - 1 },
          });
        }
      }

      return tx.branch.update({
        where: { id: branchId },
        data: {
          name: input.name,
          location: input.location,
          address: input.address,
          mapUrl: input.mapUrl,
          type: input.type,
          order: targetOrder,
        },
      });
    });

    await logAction({
      userId,
      action: AuditAction.UPDATE,
      entity: "Branch",
      entityId: updated.id,
      oldData: {
        id: existing.id,
        name: existing.name,
        order: existing.order,
      },
      newData: {
        id: updated.id,
        name: updated.name,
        order: updated.order,
      },
    });

    return updated;
  } catch (error) {
    throw mapKnownPrismaError(error);
  }
};

export const deleteBranch = async (branchId: string, userId?: string) => {
  const existing = await ensureBranchExists(branchId);

  await prisma.$transaction(async (tx) => {
    await tx.branch.delete({ where: { id: branchId } });

    const affected = await tx.branch.findMany({
      where: {
        order: { gt: existing.order },
      },
      orderBy: {
        order: "asc",
      },
    });

    for (const item of affected) {
      await tx.branch.update({
        where: { id: item.id },
        data: { order: item.order - 1 },
      });
    }
  });

  await logAction({
    userId,
    action: AuditAction.DELETE,
    entity: "Branch",
    entityId: existing.id,
    oldData: {
      id: existing.id,
      name: existing.name,
      order: existing.order,
    },
  });

  return { success: true };
};

export const getBranchMembers = async (
  branchId: string,
  filters: ListBranchMemberFilters = {}
) => {
  await ensureBranchExists(branchId);

  const shouldPaginate = filters.page !== undefined && filters.limit !== undefined;
  const skip = shouldPaginate ? (filters.page! - 1) * filters.limit! : undefined;
  const take = shouldPaginate ? filters.limit : undefined;

  const where = {
    branchId,
    member: filters.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { role: { contains: filters.search, mode: "insensitive" as const } },
            { email: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : undefined,
  };

  if (!shouldPaginate) {
    return prisma.branchMember.findMany({
      where,
      include: {
        member: true,
      },
      orderBy: { order: "asc" },
    });
  }

  const [items, total] = await Promise.all([
    prisma.branchMember.findMany({
      where,
      include: {
        member: true,
      },
      orderBy: { order: "asc" },
      skip,
      take,
    }),
    prisma.branchMember.count({ where }),
  ]);

  const page = filters.page!;
  const limit = filters.limit!;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const assignMemberToBranch = async (
  branchId: string,
  input: AssignMemberInput,
  userId?: string
) => {
  await ensureBranchExists(branchId);
  await ensureMemberExists(input.memberId);

  const exists = await prisma.branchMember.findFirst({
    where: {
      branchId,
      memberId: input.memberId,
    },
  });

  if (exists) {
    throw httpError(409, "Member is already assigned to this branch");
  }

  const total = await prisma.branchMember.count({ where: { branchId } });
  const desiredOrder = clamp(input.order ?? total + 1, 1, total + 1);

  const created = await prisma.$transaction(async (tx) => {
    const affected = await tx.branchMember.findMany({
      where: {
        branchId,
        order: { gte: desiredOrder },
      },
      orderBy: {
        order: "desc",
      },
    });

    for (const item of affected) {
      await tx.branchMember.update({
        where: { id: item.id },
        data: { order: item.order + 1 },
      });
    }

    return tx.branchMember.create({
      data: {
        branchId,
        memberId: input.memberId,
        order: desiredOrder,
      },
      include: {
        member: true,
      },
    });
  });

  await logAction({
    userId,
    action: AuditAction.CREATE,
    entity: "BranchMember",
    entityId: created.id,
    newData: {
      id: created.id,
      branchId: created.branchId,
      memberId: created.memberId,
      order: created.order,
    },
  });

  return created;
};

export const updateBranchMemberOrder = async (
  branchId: string,
  memberId: string,
  order: number,
  userId?: string
) => {
  const existing = await ensureAssignmentExists(branchId, memberId);
  const total = await prisma.branchMember.count({ where: { branchId } });
  const targetOrder = clamp(order, 1, total);

  if (targetOrder === existing.order) {
    return prisma.branchMember.findUniqueOrThrow({
      where: { id: existing.id },
      include: { member: true },
    });
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.branchMember.update({
      where: { id: existing.id },
      data: { order: 0 },
    });

    if (targetOrder < existing.order) {
      const affected = await tx.branchMember.findMany({
        where: {
          branchId,
          id: { not: existing.id },
          order: {
            gte: targetOrder,
            lt: existing.order,
          },
        },
        orderBy: {
          order: "desc",
        },
      });

      for (const item of affected) {
        await tx.branchMember.update({
          where: { id: item.id },
          data: { order: item.order + 1 },
        });
      }
    }

    if (targetOrder > existing.order) {
      const affected = await tx.branchMember.findMany({
        where: {
          branchId,
          id: { not: existing.id },
          order: {
            gt: existing.order,
            lte: targetOrder,
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      for (const item of affected) {
        await tx.branchMember.update({
          where: { id: item.id },
          data: { order: item.order - 1 },
        });
      }
    }

    return tx.branchMember.update({
      where: { id: existing.id },
      data: { order: targetOrder },
      include: {
        member: true,
      },
    });
  });

  await logAction({
    userId,
    action: AuditAction.UPDATE,
    entity: "BranchMember",
    entityId: updated.id,
    oldData: {
      id: existing.id,
      branchId: existing.branchId,
      memberId: existing.memberId,
      order: existing.order,
    },
    newData: {
      id: updated.id,
      branchId: updated.branchId,
      memberId: updated.memberId,
      order: updated.order,
    },
  });

  return updated;
};

export const removeMemberFromBranch = async (
  branchId: string,
  memberId: string,
  userId?: string
) => {
  const existing = await ensureAssignmentExists(branchId, memberId);

  await prisma.$transaction(async (tx) => {
    await tx.branchMember.delete({ where: { id: existing.id } });

    const affected = await tx.branchMember.findMany({
      where: {
        branchId,
        order: { gt: existing.order },
      },
      orderBy: {
        order: "asc",
      },
    });

    for (const item of affected) {
      await tx.branchMember.update({
        where: { id: item.id },
        data: { order: item.order - 1 },
      });
    }
  });

  await logAction({
    userId,
    action: AuditAction.DELETE,
    entity: "BranchMember",
    entityId: existing.id,
    oldData: {
      id: existing.id,
      branchId: existing.branchId,
      memberId: existing.memberId,
      order: existing.order,
    },
  });

  return { success: true };
};
