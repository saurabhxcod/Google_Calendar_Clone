import mongoose, { Document, Schema } from 'mongoose';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface IEvent extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    startTime: Date;   // UTC
    endTime: Date;     // UTC
    allDay: boolean;
    color: string;
    location?: string;
    recurrence: RecurrenceType;
    recurrenceEnd?: Date;
    recurrenceGroupId?: string; // groups recurring instances
    isException: boolean;       // edited individual instance
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, maxlength: 2000 },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        allDay: { type: Boolean, default: false },
        color: {
            type: String,
            default: '#039be5',
        },
        location: { type: String, maxlength: 500 },
        recurrence: {
            type: String,
            enum: ['none', 'daily', 'weekly', 'monthly'],
            default: 'none',
        },
        recurrenceEnd: { type: Date },
        recurrenceGroupId: { type: String, index: true },
        isException: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for efficient date-range queries
EventSchema.index({ userId: 1, startTime: 1, endTime: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);