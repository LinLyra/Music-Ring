import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { PlayPhase, RecentPlay } from '@/hooks/use-play';
import { useTheme } from '@/hooks/use-theme';

interface PlayFeedbackProps {
  phase: PlayPhase;
  recent: RecentPlay | null;
  errorMessage: string | null;
}

/**
 * 演奏反馈区（mobile-client.md §6.2 / §8.4 / §10）。
 * - 展示最近一次演奏信息与Status。
 * - 成功不弹阻塞式弹窗，仅内联展示；错误用醒目颜色。
 */
export function PlayFeedback({ phase, recent, errorMessage }: PlayFeedbackProps) {
  const theme = useTheme();

  const statusText =
    phase === 'sending'
      ? 'Sending...'
      : phase === 'success'
        ? 'Play request sent'
        : phase === 'error'
          ? 'Play request failed'
          : 'Waiting to play';

  const statusColor =
    phase === 'success' ? theme.success : phase === 'error' ? theme.danger : theme.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.line}>
        <ThemedText type="small" themeColor="textSecondary">
          Last note
        </ThemedText>
        <ThemedText type="smallBold" numberOfLines={1}>
          {recent
            ? `${recent.instrumentName} / ${recent.key} / ${recent.noteLabel} (${recent.techniqueName})`
            : 'None'}
        </ThemedText>
      </View>

      <View style={styles.line}>
        <ThemedText type="small" themeColor="textSecondary">
          Status
        </ThemedText>
        <View style={styles.statusGroup}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <ThemedText type="smallBold" style={{ color: statusColor }}>
            {statusText}
          </ThemedText>
        </View>
      </View>

      {phase === 'error' && errorMessage && (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {errorMessage}
        </ThemedText>
      )}

      {phase === 'success' &&
        recent?.warnings?.map((warning, index) => (
          <ThemedText key={index} type="small" style={{ color: theme.warning }}>
            {warning}
          </ThemedText>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
