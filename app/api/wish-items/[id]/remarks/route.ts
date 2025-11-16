import { NextRequest, NextResponse } from 'next/server';
import { remarkModel } from '@/lib/models/remark';
import { z } from 'zod';

const createRemarkSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wishItemId = parseInt(params.id);
    if (isNaN(wishItemId)) {
      return NextResponse.json(
        { error: 'Invalid wish item ID' },
        { status: 400 }
      );
    }

    const remarks = remarkModel.getByWishItemId(wishItemId);
    return NextResponse.json(remarks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch remarks' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wishItemId = parseInt(params.id);
    if (isNaN(wishItemId)) {
      return NextResponse.json(
        { error: 'Invalid wish item ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = createRemarkSchema.parse(body);

    const remark = remarkModel.create({
      wish_item_id: wishItemId,
      content: validated.content,
    });

    return NextResponse.json(remark, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create remark' },
      { status: 500 }
    );
  }
}

