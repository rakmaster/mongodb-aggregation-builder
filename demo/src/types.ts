// MongoDB Aggregation Pipeline Stage Types

export interface MatchStage {
  $match: Record<string, any>;
}

export interface GroupStage {
  $group: {
    _id: any;
    [key: string]: any; // accumulators like $sum, $avg, etc.
  };
}

export interface ProjectStage {
  $project: Record<string, any>;
}

export interface SortStage {
  $sort: Record<string, 1 | -1>;
}

export interface UnwindStage {
  $unwind: string | {
    path: string;
    includeArrayIndex?: string;
    preserveNullAndEmptyArrays?: boolean;
  };
}

export interface LookupStage {
  $lookup: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  };
}

// Add more stages as needed
export interface AddFieldsStage {
  $addFields: Record<string, any>;
}

export interface LimitStage {
  $limit: number;
}

export interface SkipStage {
  $skip: number;
}

export type AggregationStage = Record<string, any>

export type Pipeline = AggregationStage[];

// Props types
export interface ConnectionConfig {
  uri: string
  database: string
  collection: string
}

export interface ThemeConfig {
  [key: string]: string
}

export interface MongoAggregationBuilderProps {
  connection?: ConnectionConfig
  theme?: ThemeConfig
}
