import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  getCustomersByMatchmaker,
  getCustomerById,
  updateCustomer,
} from './customers.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export async function listCustomers(req: Request, res: Response): Promise<void> {
  const { page, limit, search, status_tag, gender } = req.query;

  try {
    const result = await getCustomersByMatchmaker({
      matchmakerId: req.matchmaker!.matchmakerId,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? Math.min(parseInt(limit as string, 10), 50) : 20,
      search: typeof search === 'string' ? search : undefined,
      statusTag: typeof status_tag === 'string' ? status_tag : undefined,
      gender: typeof gender === 'string' ? gender : undefined,
    });

    sendSuccess(res, result, 'Customers fetched successfully');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to fetch customers', 500);
  }
}

export async function getCustomer(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  try {
    const customer = await getCustomerById(id, req.matchmaker!.matchmakerId);

    if (!customer) {
      sendError(res, 'Customer not found or not assigned to you', 404);
      return;
    }

    sendSuccess(res, customer, 'Customer fetched successfully');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to fetch customer', 500);
  }
}

const updateSchema = z.object({
  status_tag: z.enum(['new', 'active', 'matched', 'paused', 'closed']).optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

export async function patchCustomer(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const parsed = updateSchema.safeParse(req.body);

  if (!parsed.success) {
    const msg = parsed.error.issues?.[0]?.message || 'Validation error';
    sendError(res, msg, 422);
    return;
  }

  try {
    const updated = await updateCustomer(id, req.matchmaker!.matchmakerId, parsed.data);
    sendSuccess(res, updated, 'Customer updated successfully');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update customer', 500);
  }
}
