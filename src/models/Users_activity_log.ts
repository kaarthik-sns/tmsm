import { Schema, model, models, Document, Model } from "mongoose";

// 1. Define basic TypeScript interface
interface IActivityLog {
  user_id: string;
  desc: string;
  created_at?: Date;
}

// 2. Extend Mongoose Document for type safety
interface IActivityLogDoc extends IActivityLog, Document {}

// 3. Create schema
const users_activity_log_Schema = new Schema<IActivityLogDoc>({
  user_id: { type: String, required: true },
  desc: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
}, {
  collection: "users_activity_log"
});

// 4. Export the model with types so TypeScript knows `.create()` is valid
const users_activity_log: Model<IActivityLogDoc> =
  models.users_activity_log as Model<IActivityLogDoc> ||
  model<IActivityLogDoc>("users_activity_log", users_activity_log_Schema);

export default users_activity_log;
