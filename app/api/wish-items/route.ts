import { NextRequest, NextResponse } from 'next/server';
import { wishItemModel } from '@/lib/models/wish-item';
import { z } from 'zod';

const createWishItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['wish', 'in_progress', 'achieved']).optional(),
  category_id: z.number().nullable().optional(),
  remarks: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('category_id');

    let items;
    if (status && ['wish', 'in_progress', 'achieved'].includes(status)) {
      items = wishItemModel.getByStatus(status as 'wish' | 'in_progress' | 'achieved');
    } else if (categoryId) {
      items = wishItemModel.getByCategory(parseInt(categoryId));
    } else {
      items = wishItemModel.getAll();
    }

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wish items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createWishItemSchema.parse(body);
    
    const item = wishItemModel.create(validated);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create wish item' },
      { status: 500 }
    );
  }
}

