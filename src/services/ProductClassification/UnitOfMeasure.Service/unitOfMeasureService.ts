import { ResultService } from "../../../types/Base/ResultService";
import { UnitOfMeasure } from "../../../types/ProductClassification/UnitOfMeasure/UnitOfMeasure";
import { UNIT_OF_MEASURE_API_URL } from "../../apiConfig";

// Cache for storing fetched units of measure
let unitOfMeasureCache: UnitOfMeasure[] | null = null;

export async function getAllUnitsOfMeasure(options: { cache: boolean } = { cache: true }): Promise<ResultService<UnitOfMeasure[]>> {
  if (options.cache && unitOfMeasureCache) {
    return { code: "0", message: "Success", data: unitOfMeasureCache };
  }

  const response = await fetch(UNIT_OF_MEASURE_API_URL);
  if (!response.ok) {
    throw new Error("Error when calling API for UnitOfMeasure");
  }
  const result: ResultService<UnitOfMeasure[]> = await response.json();
  unitOfMeasureCache = result.data;
  return result;
}

export async function getUnitOfMeasureById(id: number): Promise<UnitOfMeasure> {
  const response = await fetch(`${UNIT_OF_MEASURE_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching unit of measure with ID ${id}`);
  }
  return response.json();
}

export async function deleteUnitOfMeasure(id: number): Promise<void> {
  const response = await fetch(UNIT_OF_MEASURE_API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
  if (!response.ok) {
    throw new Error(`Error deleting unit of measure with ID ${id}`);
  }
}

export async function getUnitOfMeasureByCode(uomCode: string): Promise<ResultService<UnitOfMeasure>> {
  const response = await fetch(`${UNIT_OF_MEASURE_API_URL}/code/${uomCode}`);
  if (!response.ok) {
    throw new Error(`Error fetching unit of measure with code ${uomCode}`);
  }
  return response.json();
}

export async function saveUnitOfMeasureByDapper(unitOfMeasure: UnitOfMeasure): Promise<ResultService<UnitOfMeasure>> {
  const response = await fetch(`${UNIT_OF_MEASURE_API_URL}/SaveByDapper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unitOfMeasure),
  });
  if (!response.ok) {
    throw new Error("Error saving unit of measure");
  }
  const result = await response.json();
  if (result.code === "0" && unitOfMeasureCache) {
    const index = unitOfMeasureCache.findIndex((u) => u.uoMCode === unitOfMeasure.uoMCode);
    if (index !== -1) {
      unitOfMeasureCache[index] = result.data;
    } else {
      unitOfMeasureCache.push(result.data);
    }
  }
  return result;
}

export async function deleteUnitOfMeasureByDapper(uomCode: string): Promise<ResultService<void>> {
  const response = await fetch(`${UNIT_OF_MEASURE_API_URL}/DeleteByDapper?uoMCode=${encodeURIComponent(uomCode)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting unit of measure with code ${uomCode}`);
  }
  const result = await response.json();
  if (result.code === "0" && unitOfMeasureCache) {
    unitOfMeasureCache = unitOfMeasureCache.filter((u) => u.uoMCode !== uomCode);
  }
  return result;
}

export function clearUnitOfMeasureCache(): void {
  unitOfMeasureCache = null;
}