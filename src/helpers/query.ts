import { ObjectLiteral } from "typeorm";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    filterByStatus(this: SelectQueryBuilder<Entity>, statusId: number | ''): SelectQueryBuilder<Entity>,
    filterByExecutor(this: SelectQueryBuilder<Entity>, executorId: number | ''): SelectQueryBuilder<Entity>,
    filterByLabel(this: SelectQueryBuilder<Entity>, labelId: number | ''): SelectQueryBuilder<Entity>,
    filterOwn(this: SelectQueryBuilder<Entity>, userId: number | '' | undefined): SelectQueryBuilder<Entity>,
  }
}

SelectQueryBuilder.prototype.filterByStatus = function <Entity extends ObjectLiteral>(this: SelectQueryBuilder<Entity>, statusId: number | ''): SelectQueryBuilder<Entity> {
  if (statusId) {
    this.andWhere(`${this.alias}.status.id = :statusId`, { statusId })
  }

  return this;
}

SelectQueryBuilder.prototype.filterByExecutor = function <Entity extends ObjectLiteral>(this: SelectQueryBuilder<Entity>, executorId: number | ''): SelectQueryBuilder<Entity> {
  if (executorId) {
    this.andWhere(`${this.alias}.executor.id = :executorId`, { executorId })
  }

  return this;
}

SelectQueryBuilder.prototype.filterByLabel = function <Entity extends ObjectLiteral>(this: SelectQueryBuilder<Entity>, labelId: number | ''): SelectQueryBuilder<Entity> {
  if (labelId) {
    this.andWhere(`labels.id = :labelId`, { labelId })
  }

  return this;
}

SelectQueryBuilder.prototype.filterOwn = function <Entity extends ObjectLiteral>(this: SelectQueryBuilder<Entity>, userId: number | '' | undefined): SelectQueryBuilder<Entity> {
  if (userId) {
    this.andWhere(`${this.alias}.creator.id = :userId`, { userId })
  }

  return this;
}