// This is the public shape of a Task as returned by the API
export interface Task {
  id: string;
  type: "task";
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  parent_spec: string | null;
  // NOTE: You'll likely want to parse the title/content from the markdown body
  // and add it here for list views in the frontend.
  title?: string;
}
