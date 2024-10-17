import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export function GenerateShortId(prefix?: string, size = 8): string {
  return `${prefix || ''}_${nanoid(size)}`;
}

export function GenerateComponentId(type: string): string {
  return `${type.toUpperCase()}_${nanoid(8)}`;
}

export function GenerateNestedComponentId(parentId: string, componentType: string): string {
  return `${parentId}_${componentType.toUpperCase()}`;
}

export function GenerateComponentCode(type: string): string {
  return GenerateShortId(type, 8).toLocaleUpperCase().replace('-', '_');
};