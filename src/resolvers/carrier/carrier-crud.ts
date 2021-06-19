import { Resolver, Query } from "type-graphql";
@Resolver()
export class CarrierCrudResolver {
  @Query(() => String)
  async carrierWorld() {
    return "Carrier World!";
  }
}
