import { Button, TextInput } from "@mantine/core";
import { IconScreenShare } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const Popup = () => {
  const [server, setServer] = useState("");

  useEffect(() => {
    chrome.storage.local.get("server").then((value) => {
      if (value.server) setServer(value.server);
    });
  }, []);

  return (
    <main className={"p-5"}>
      <div className={"flex flex-col gap-1"}>
        <TextInput
          label={"Server"}
          value={server}
          onChange={(e) => {
            setServer(e.target.value);
          }}
        />
        <Button
          leftSection={<IconScreenShare />}
          variant={"gradient"}
          onClick={() => {
            void chrome.storage.local.set({
              server,
            });

            void chrome.runtime.sendMessage({
              server,
              action: "startStream",
            });
          }}
        >
          Start streaming
        </Button>
      </div>
    </main>
  );
};

export default Popup;
