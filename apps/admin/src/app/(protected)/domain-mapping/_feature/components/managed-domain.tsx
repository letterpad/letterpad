"use client";

import { useDomainQuery } from "letterpad-graphql/hooks";

import { Spinner } from "@/components/loading";

export function ManagedDomain({ description }: { description: string }) {
  const [{ data, fetching, error }] = useDomainQuery();
  const domain = data?.domain.__typename === "Domain" ? data.domain : null;

  return (
    <div className="flex flex-col gap-3">
      <p>{description}</p>
      {fetching ? (
        <Spinner />
      ) : error ? (
        <p>Could not load your custom domain.</p>
      ) : domain ? (
        <p>
          {domain.mapped ? "Custom domain" : "Saved domain"}:{" "}
          <strong>{domain.name}</strong>
        </p>
      ) : (
        <p>No custom domain is linked.</p>
      )}
    </div>
  );
}
