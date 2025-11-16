import { NextRequest, NextResponse } from 'next/server';
import { remarkModel } from '@/lib/models/remark';
import { z } from 'zod';

const updateRemarkSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid remark ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = updateRemarkSchema.parse(body);

    const remark = remarkModel.update(id, validated);
    if (!remark) {
      return NextResponse.json(
        { error: 'Remark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(remark);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update remark' },
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
        { error: 'Invalid remark ID' },
        { status: 400 }
      );
    }

    const deleted = remarkModel.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Remark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete remark' },
      { status: 500 }
    );
  }
}

