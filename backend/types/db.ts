export type DatabaseError = {
  length: number;
  severity: "ERROR" | "WARNING" | "NOTICE" | "INFO"; // Adjust based on possible severity levels
  code: string;
  detail: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
  file?: string;
  line?: string;
  routine?: string;
};
