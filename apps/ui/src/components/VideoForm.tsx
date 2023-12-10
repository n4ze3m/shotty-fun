import { useForm } from "@mantine/form";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { IconWorldWww, IconWriting } from "@tabler/icons-react";
import {
  Title,
  Select,
  Button,
  Tabs,
  rem,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import React from "react";
import classes from "./VideoForm.module.css";

type Props = {
  setAppState: (value: "form" | "loading" | "done") => void;
  setVideId: (val: ((prevState: null) => null) | null) => void;
  setVideoStatus: (val: ((prevState: null) => null) | null) => void;
};

export const VideoForm: React.FC<Props> = ({
  setAppState,
  setVideId,
  setVideoStatus,
}) => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [type, setType] = React.useState<string | null>("url");

  const formUrl = useForm({
    initialValues: {
      platform: "tiktok",
      content: "",
    },
    validate: {
      platform: (value) => (!value ? "A platform is required" : null),
      content: (value) =>
        !value || value.trim() === "" ? "URL is required" : null,
    },
  });

  const formText = useForm({
    initialValues: {
      platform: "tiktok",
      content: "",
    },
    validate: {
      platform: (value) => (!value ? "A platform is required" : null),
      content: (value) =>
        !value || value.trim() === "" ? "Text is required" : null,
    },
  });

  const generateRequest = async (values: any) => {
    const baseURL = import.meta.env.VITE_API_URL || "/api/v1";
    const response = await axios.post(`${baseURL}/generate`, {
      ...values,
      type,
    });

    return response.data;
  };

  const { mutate: generate, isPending } = useMutation({
    mutationFn: generateRequest,
    onSuccess: (data) => {
      setAppState("loading");
      setVideId(data.video_id);
      setVideoStatus(data.status);
    },
  });

  return (
    <>
      <Title
        order={2}
        size="h2"
        style={{ marginBottom: 40, textAlign: "center" }}
        ta="center"
      >
        {"Transforming URLs / Text into TikTok or Instagram like Shorts"}
      </Title>
      <Tabs className={classes.tab} defaultValue={type} onChange={setType}>
        <Tabs.List grow>
          <Tabs.Tab
            value="url"
            leftSection={<IconWorldWww style={iconStyle} />}
          >
            URL
          </Tabs.Tab>
          <Tabs.Tab
            value="text"
            leftSection={<IconWriting style={iconStyle} />}
          >
            Text
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="url">
          <form
            className={classes.form}
            onSubmit={formUrl.onSubmit((v) => {
              generate(v);
            })}
          >
            <TextInput
              mb="md"
              label="URL"
              placeholder="https://n4ze3m.com"
              required
              type="url"
              {...formUrl.getInputProps("content")}
            />

            <Select
              mb="md"
              data={[
                { value: "tiktok", label: "TikTok" },
                { value: "instagram", label: "Instagram" },
                { value: "linkedin", label: "LinkedIn" },
              ]}
              label="Select Platform"
              placeholder="Select Platform"
              required
              {...formUrl.getInputProps("platform")}
            />

            <Button loading={isPending} type="submit" fullWidth color="teal">
              Generate
            </Button>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="text">
          <form
            onSubmit={formText.onSubmit((v) => {
              generate(v);
            })}
            className={classes.form}
          >
            <Textarea
              mb="md"
              label="Text"
              placeholder="Write anything here"
              required
              {...formText.getInputProps("content")}
            />

            <Select
              mb="md"
              data={[
                { value: "tiktok", label: "TikTok" },
                { value: "instagram", label: "Instagram" },
                { value: "linkedin", label: "LinkedIn" },
              ]}
              label="Select Platform"
              placeholder="Select Platform"
              required
              {...formText.getInputProps("platform")}
            />

            <Button loading={isPending} type="submit" fullWidth color="teal">
              Generate
            </Button>
          </form>
        </Tabs.Panel>
      </Tabs>
      <Text size="xs" mt="md" c="dimmed" ta="center">
        Application is slow because it's running on a cheap VPS. Please be
        patient.
      </Text>
      <Text size="xs" mt="md" c="dimmed" ta="center">
        {"Like this project? "}
        <a target="__blank" href="https://ko-fi.com/n4ze3m">
          {"Buy me a coffee."}
        </a>
      </Text>
    </>
  );
};
