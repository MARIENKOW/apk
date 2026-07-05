import { redirect } from "next/navigation";

export default function CatchAllNotFound() {
    return redirect("https://www.google.com/");
}
