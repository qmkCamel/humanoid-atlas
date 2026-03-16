/**
 * Full-screen title card for intros, outros, and scene transitions.
 * Uses the Humanoid Atlas design language.
 */

import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AnimatedText } from './AnimatedText';

export interface TitleCardProps {
  /** Main heading */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Background color */
  bg?: string;
  /** Text color */
  color?: string;
  /** Show the horizontal rule accent */
  accent?: boolean;
  /** Fade-in delay in frames */
  delay?: number;
}

export function TitleCard({
  title,
  subtitle,
  bg = '#f5f2ed',
  color = '#1a1a1a',
  accent = true,
  delay = 0,
}: TitleCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineSpring = spring({
    frame: frame - delay - 5,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const lineWidth = interpolate(lineSpring, [0, 1], [0, 120]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <AnimatedText
        text={title}
        startFrame={delay}
        animation="fade-up"
        fontSize={52}
        fontWeight={400}
        color={color}
        letterSpacing={6}
        style={{ textAlign: 'center', maxWidth: '80%' }}
      />

      {accent && (
        <div
          style={{
            width: lineWidth,
            height: 2,
            backgroundColor: color,
            opacity: 0.3,
          }}
        />
      )}

      {subtitle && (
        <AnimatedText
          text={subtitle}
          startFrame={delay + 10}
          animation="fade"
          fontSize={20}
          fontWeight={300}
          color={color}
          letterSpacing={4}
          style={{ opacity: 0.6, textAlign: 'center' }}
        />
      )}
    </AbsoluteFill>
  );
}
