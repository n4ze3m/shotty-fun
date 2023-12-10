import { Center, Loader, Text } from "@mantine/core";
import classes from "./VideoForm.module.css";
import React from "react";

type Props = {
  videoStatus?: string;
};

export const VideoProcessing: React.FC<Props> = ({ videoStatus }) => {
  const [message] = React.useState<Record<string, string>>({
    pending: "Hold on, your in queue",
    processing: "Processing your video",
    done: "Your video is ready",
    fetching: "Fetching your video",
    loading: "Processing your video",
  });

  return (
    <Center
      className={classes.form}
      style={{
        flexDirection: "column",
      }}
    >
      <Loader mb="md" size="lg" color="teal" />
      {videoStatus && (
        <Text fw={700} size="lg">
          {message[videoStatus]}
        </Text>
      )}
    </Center>
  );
};
