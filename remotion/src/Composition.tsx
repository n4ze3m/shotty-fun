import {useEffect, useState} from 'react';
import {Audio, useCurrentFrame, AbsoluteFill, OffthreadVideo} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily} = loadFont();
type Chunk = {
	start: number;
	end: number;
	text: string;
};

type VideosType = {
	start: number;
	end: number;
	video_file: string;
};
export type RedditTiktokTestProps = {
	script: string;
	transcript: {
		chunks: Chunk[];
		videos: VideosType[];
	};
	frame: number;
	audioUrl?: string;
	id: string;
};

export const RedditTiktokTest: React.FC<RedditTiktokTestProps> = ({
	transcript,
	audioUrl,
}) => {
	const frame = useCurrentFrame();

	const [videoFile, setVideoFile] = useState<string>(
		transcript.videos[0].video_file
	);

	useEffect(() => {
		transcript.videos.map((item) => {
			if (frame > item.start * 30 && frame < item.end * 30) {
				if (videoFile !== item.video_file) {
					setVideoFile(item.video_file);
				}
			}
		});
	}, [frame]);

	return (
		<>
			{transcript.chunks.map((item) => {
				if (frame > item.start * 30 && frame < item.end * 30) {
					return (
						<div
							style={{
								fontSize: 100,
								color: 'yellow',
								fontWeight: 'bold',
								textShadow: '0px 0px 30px black',
								textAlign: 'center',
								width: '100%',
								position: 'absolute',
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 9999,
								fontFamily,
								textTransform: 'uppercase',
								// add moving animation
								animation: `move ${item.end - item.start}s linear infinite`,
							}}
						>
							{item.text}
						</div>
					);
				}
			})}
			<AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
				{videoFile.length > 0 && (
					<OffthreadVideo
						muted
						style={{objectFit: 'cover', width: '100%', height: '100%'}}
						src={videoFile}
					/>
				)}
			</AbsoluteFill>
			{audioUrl ? <Audio src={audioUrl} volume={1} /> : null}
		</>
	);
};
