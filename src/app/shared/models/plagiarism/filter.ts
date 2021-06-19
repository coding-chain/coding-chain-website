export interface ISuspectFunctionsFilter {
  lowerThanDate?: Date;
  greaterThanDate?: Date;
  excludedUserId?: string;
  functionsIds?: string[];
  languageId?: string;
}
