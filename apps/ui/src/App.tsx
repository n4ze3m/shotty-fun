import { AppShell, Text, Group, Center } from "@mantine/core";
import classes from "./App.module.css";
import React from "react";
import { useLocalStorage } from "@mantine/hooks";
import { VideoForm } from "./components/VideoForm";
import { VideoProcessing } from "./components/VideoProcessing";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { VideoDone } from "./components/VideoDone";

function App() {
  const [appState, setAppState] = React.useState<
    "form" | "loading" | "processing" | "done" | "pending"
  >("form");
  const [videoId, setVideId] = useLocalStorage({
    key: "videoId",
    defaultValue: null,
  });

  const [videoStatus, setVideoStatus] = useLocalStorage({
    key: "videoStatus",
    defaultValue: null,
  });

  React.useEffect(() => {
    if (videoId) {
      if (videoStatus !== "done") {
        setAppState("loading");
      } else if (videoStatus === "done") {
        setAppState("done");
      }
    } else {
      setAppState("form");
    }
  }, [videoId]);

  const { data: videoInfo, status: videoInfoStatus } = useQuery({
    queryKey: ["fetchVideoInfo", videoId],
    enabled: !!videoId,
    queryFn: async () => {
      const baseURL = import.meta.env.VITE_API_URL || "/api/v1";
      const response = await axios.get(`${baseURL}/generate/${videoId}/info`);
      return response.data["data"];
    },
    refetchInterval: videoStatus !== "done" ? 5000 : false,
  });

  React.useEffect(() => {
    if (videoInfo) {
      setVideoStatus(videoInfo.status);
      setAppState(videoInfo.status);
    }
  }, [videoInfo]);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <div className={classes.header}>
          <Group justify="space-between">
            <Text size="xl" fw={700}>
              {"Shotty 🎥"}
            </Text>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Main>
        <div className={classes.main}>
          {appState === "form" && (
            <VideoForm
              setAppState={setAppState}
              setVideId={setVideId}
              setVideoStatus={setVideoStatus}
            />
          )}
          {appState === "loading" && (
            <VideoProcessing videoStatus={videoStatus || undefined} />
          )}
          {appState === "processing" && (
            <VideoProcessing videoStatus={videoStatus || undefined} />
          )}

          {appState === "pending" && (
            <VideoProcessing videoStatus={videoStatus || undefined} />
          )}

          {appState === "done" && videoInfoStatus === "pending" && (
            <VideoProcessing videoStatus="fetching" />
          )}
          {appState === "done" && videoInfoStatus === "success" && (
            <VideoDone data={videoInfo} />
          )}
          {appState === "done" && videoInfoStatus === "error" && (
            <div>There was an error fetching your video. Please try again.</div>
          )}
        </div>
      </AppShell.Main>
      <AppShell.Section>
        <Center>
          <Text
            component="a"
            mb="md"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/n4ze3m"
            size="xs"
            c="dimmed"
          >
            {"@n4ze3m"}
          </Text>
        </Center>
      </AppShell.Section>
    </AppShell>
  );
}

export default App;
