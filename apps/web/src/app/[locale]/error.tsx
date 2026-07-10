"use client";

import ErrorElement from "@/components/feedback/error/ErrorElement";
console.log('');
export default function ErrorPage({ error }: { error: Error }) {
    return <ErrorElement message={error?.message} />;
}
