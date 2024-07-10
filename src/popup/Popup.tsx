import { Button, NumberInput, TextInput } from "@mantine/core";
import { IconScreenShare } from "@tabler/icons-react";
import { useEffect } from "react";
import { useSetState } from "@mantine/hooks";

export const Popup = () => {
  const [config, setConfig] = useSetState({
    server: "",
    fps: 240,
    width: 80,
    height: 80,
    resWidth: 1920,
    resHeight: 1080,
  });

  useEffect(() => {
    chrome.storage.local.get("config").then((value) => {
      if (value.config) setConfig(value.config);
    });
  }, []);

  return (
    <main className={"p-5"}>
      <div className={"flex flex-col gap-1"}>
        <TextInput
          size={"xs"}
          label={"Server"}
          value={config.server}
          onChange={(e) => {
            setConfig({
              server: e.target.value,
            });
          }}
        />
        <NumberInput
          size={"xs"}
          label={"Fps"}
          value={config.fps}
          onChange={(e) => {
            setConfig({
              fps: +e,
            });
          }}
        />
        <div className={"flex flex-row gap-2"}>
          <NumberInput
            size={"xs"}
            label={"Capture"}
            placeholder={"Width"}
            value={config.width}
            onChange={(e) => {
              setConfig({
                width: +e,
              });
            }}
          />
          <NumberInput
            size={"xs"}
            label={" "}
            placeholder={"Height"}
            value={config.height}
            onChange={(e) => {
              setConfig({
                height: +e,
              });
            }}
          />
        </div>
        <div className={"flex flex-row gap-2"}>
          <NumberInput
            size={"xs"}
            label={"Resolution"}
            placeholder={"Width"}
            value={config.resWidth}
            onChange={(e) => {
              setConfig({
                resWidth: +e,
              });
            }}
          />
          <NumberInput
            size={"xs"}
            label={" "}
            placeholder={"Height"}
            value={config.resHeight}
            onChange={(e) => {
              setConfig({
                resHeight: +e,
              });
            }}
          />
        </div>
        <Button
          className={"mt-2"}
          leftSection={<IconScreenShare />}
          variant={"gradient"}
          onClick={() => {
            void chrome.storage.local.set({
              config,
            });

            void chrome.runtime.sendMessage({
              config,
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
