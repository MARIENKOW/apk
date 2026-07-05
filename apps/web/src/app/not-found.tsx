import { redirect } from "next/navigation";

export default async function NotFound() {
    return redirect("https://www.google.com/");
}
