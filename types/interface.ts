export interface validataType {
	rulesArray: string[],
	data: Record<string, any>
}

export type DataType = 'string' | 'number' | 'boolean' | 'array' | 'email' | 'pwd' | 'date';
