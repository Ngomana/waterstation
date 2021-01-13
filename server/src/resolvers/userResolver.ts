import { compare, hash } from "bcryptjs";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Field,
  ObjectType,
} from "type-graphql";
import { createAccessToken, createRefreshToken } from "../auth";
import { iContext } from "../context";
import { UserModel } from "../entity/user";
import { sendRefreshToken } from "../sentRefreshTokens";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi";
  }
  @Mutation(() => Boolean)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hassPassword = await hash(password, 12);

    try {
      // check if user already exits
      // const findUser = await UserModel.findOne({});
      const user = await UserModel.create({
        email,
        password: hassPassword,
      });

      return (await user.save()) && true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: iContext
  ): Promise<LoginResponse> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("incorrect password");
    }

    //succesfully login
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }
}
