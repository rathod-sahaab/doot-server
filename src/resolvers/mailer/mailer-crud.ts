import { Resolver, Query } from "type-graphql";

@Resolver()
export class MailerCrudResolver {
  @Query(() => String)
  async mailerWorld() {
    return "Mailer World!";
  }
}
