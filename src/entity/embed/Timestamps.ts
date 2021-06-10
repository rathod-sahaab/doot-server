import { CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * Add this type as column type to add
 * createdAt and updatedAt columns
 */
export class Timestamps {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
