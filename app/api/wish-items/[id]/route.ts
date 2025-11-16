import { NextRequest, NextResponse } from 'next/server';
import { wishItemModel } from '@/lib/models/wish-item';
import { z } from 'zod';

const updateWishItemSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['wish', 'in_progress', 'achieved']).optional(),
  category_id: z.number().nullable().optional(),
  remarks: z.string().optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid wish item ID' },
        { status: 400 }
      );
    }

    const item = wishItemModel.getById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Wish item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wish item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid wish item ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = updateWishItemSchema.parse(body);

    const item = wishItemModel.update(id, validated);
    if (!item) {
      return NextResponse.json(
        { error: 'Wish item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update wish item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid wish item ID' },
        { status: 400 }
      );
    }

    const deleted = wishItemModel.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Wish item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete wish item' },
      { status: 500 }
    );
  }
}

