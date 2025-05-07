import { z } from "zod";
import { TableLocations } from "./table.types";

export const addTableSchema = z.object({
    number: z.number().positive().int(),
    location: z.nativeEnum(TableLocations)
})

export const updateTableSchema = z.object({
    number: z.number().positive().int().optional(),
    location: z.nativeEnum(TableLocations).optional()
})

export const getAllTablesSchema = z.object({
    location: z.nativeEnum(TableLocations).optional(),
    isAvailable: z.boolean().optional()
})

export const getTableByNumberSchema = z.object({
    tableNumber: z.number().positive().int()
})