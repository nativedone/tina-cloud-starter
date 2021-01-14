import React from "react";
import type * as Tina from "../.tina/types";
import { TinaCMS } from "tinacms";
import { TinaCloudAuthWall, useForm } from "tina-graphql-gateway";
import { createCloudClient, variablesFromPath } from "../utils";
import { request, Content } from "./[[...slug]]";
import { useUrlHash } from "../hooks/use-url-hash";

const client = createCloudClient();

export default function AdminPage() {
  const cms = new TinaCMS({
    apis: {
      tina: client,
    },
    sidebar: true,
    enabled: false,
  });

  return (
    <TinaCloudAuthWall cms={cms}>
      <Editor />
    </TinaCloudAuthWall>
  );
}

const Editor = () => {
  let slug = useUrlHash();
  if (!slug) {
    slug = "/";
  }

  const [data, setData] = React.useState({});

  React.useEffect(() => {
    const run = async () => {
      const response = await request(
        client,
        variablesFromPath(slug, {
          section: "posts",
          relativePath: "hello-world.md",
        })
      );

      setData(response);
    };

    run();
  }, []);

  const payload = useForm<{
    getDocument: Tina.SectionDocumentUnion;
  }>({ payload: data });

  return payload.getDocument ? (
    <Content {...payload.getDocument.data} />
  ) : (
    <p>Loading...</p>
  );
};