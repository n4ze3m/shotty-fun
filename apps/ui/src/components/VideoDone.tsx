import { Button, Center, Text, Title } from "@mantine/core";
import classes from "./VideoDone.module.css";
import ReactPlayer from "react-player";
import { IconDownload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

type Props = {
  data: any;
};

export const VideoDone: React.FC<Props> = ({ data }) => {
  const downloadVideo = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `shotty-${Date.now()}.mp4`;
    a.click();
  };

  const videoUrl = (id: string) => {
    const baseURL = import.meta.env.VITE_API_URL || "/api/v1";
    return `${baseURL}/file/${id}/video`;
  };

  const { mutate: downloadVideoMutation, isPending: isDownloading } =
    useMutation({
      mutationFn: (data: string) => downloadVideo(data),
      onError: (error: any) => {
        notifications.show({
          title: "Error",
          message: error.message || "Something went wrong",
          color: "red",
        });
      },
    });

  return (
    <Center className={classes.main}>
      <Title mb="xl">{"Here is your generated video"}</Title>
      <ReactPlayer
        url={videoUrl(data.id)}
        controls
        // width="100%"
        // height="100%"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />

      <Button
        color="teal"
        onClick={() => downloadVideoMutation(videoUrl(data.id))}
        leftSection={<IconDownload size={14} />}
        loading={isDownloading}
        my="md"
      >
        Download Video
      </Button>

      <Text size="xs" c="dimmed" ta="center">
        {"The generated video content is sourced from "}
        <a target="__blank" href="https://www.pexels.com/">
          {"Pexels."}
        </a>{" "}
        {"All rights are reserved to their respective owners"}
      </Text>

      <Text size="xs" mt="md" c="dimmed" ta="center">
        {"Like this project? "}
        <a target="__blank" href="https://ko-fi.com/n4ze3m">
          {"Buy me a coffee."}
        </a>
      </Text>
    </Center>
  );
};
