import { Center, Button, Text } from "@mantine/core";
import classes from "./VideoForm.module.css";

type Props = {
  setAppState: (value: "form" | "loading" | "done") => void;
  setVideId: (val: ((prevState: null) => null) | null) => void;
  setVideoStatus: (val: ((prevState: null) => null) | null) => void;
};

export const VideoError: React.FC<Props> = ({
  setAppState,
  setVideId,
  setVideoStatus,
}) => {
  return (
    <Center
      className={classes.form}
      style={{
        flexDirection: "column",
      }}
    >
      <Text fw={700} size="lg">
        Sorry, there was an error processing your video. Please try again.
      </Text>

      <Button
      mt="xl"
        onClick={() => {
          setAppState("form");
          setVideId(null);
          setVideoStatus(null);
        }}
        variant="outline"
        color="teal"
      >
        Try Again
      </Button>
    </Center>
  );
};
