import { Button, TextInput } from "@mantine/core";
import { IconPlant, IconScreenShare } from "@tabler/icons-react";

export const Popup = () => {
  return (
    <main className={"p-5"}>
      <div className={"flex flex-col gap-1"}>
        <TextInput label={"Server"} />
        <Button
          leftSection={<IconScreenShare />}
          variant={"gradient"}
          onClick={() => {
            void chrome.runtime.sendMessage({ action: "startStream" });
          }}
        >
          Start streaming
        </Button>
      </div>
    </main>
  );
};

export default Popup;
