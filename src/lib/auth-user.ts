import { redirect } from "next/navigation";
import { auth } from "../../auth";

export async function requireSessionUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  return session.user;
}

export async function requireUserId() {
  const user = await requireSessionUser();

  return user.id;
}
