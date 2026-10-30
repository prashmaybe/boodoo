import React, { useState } from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from './theme.js';

export const List = {};

List.Section = function ListSection({ title, children, style, titleStyle, marginVertical }) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effMarginVertical =
    marginVertical ??
    cs.listSectionMarginVertical ??
    cs.listSectionY ??
    sp.listSectionMarginVertical ??
    sp.listSectionY ??
    8;
  return (
    <View style={[{ marginVertical: effMarginVertical }, style]}>
      {title ? (
        <RNText
          style={[
            styles.listSectionTitle,
            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
            titleStyle,
          ]}
        >
          {title}
        </RNText>
      ) : null}
      {children}
    </View>
  );
};

List.Subheader = function ListSubheader({ children, style }) {
  const theme = useTheme();
  return (
    <RNText
      style={[
        styles.listSubheader,
        { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

List.Item = function ListItem({
  title,
  description,
  subtitle,
  left,
  right,
  chevron = false,
  onPress,
  disabled = false,
  paddingVertical,
  paddingHorizontal,
  style,
  titleStyle,
  descriptionStyle,
  children,
}) {
  const theme = useTheme();
  const cs = theme.componentSpacing || {};
  const sp = theme.spacing || {};
  const effPaddingVertical =
    paddingVertical ??
    cs.listItemPaddingVertical ??
    sp.listItemPaddingVertical ??
    12;
  const effPaddingHorizontal =
    paddingHorizontal ??
    cs.listItemPaddingHorizontal ??
    sp.listItemPaddingHorizontal ??
    16;
  const desc = description || subtitle;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[
        styles.listItem,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          opacity: disabled ? 0.5 : 1,
          paddingVertical: effPaddingVertical,
          paddingHorizontal: effPaddingHorizontal,
        },
        style,
      ]}
    >
      {left ? <View style={styles.itemLeftMargin}>{typeof left === 'function' ? left() : left}</View> : null}
      <View style={styles.itemContentFlex}>
        {children ? (
          children
        ) : (
          <>
            <RNText
              style={[
                styles.listItemTitle,
                { color: theme.colors.text, fontSize: theme.typography.sizes.base },
                titleStyle,
              ]}
            >
              {title}
            </RNText>
            {desc ? (
              <RNText
                style={[
                  styles.listItemDescription,
                  { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
                  descriptionStyle,
                ]}
              >
                {desc}
              </RNText>
            ) : null}
          </>
        )}
      </View>
      {right ? <View style={styles.itemRightMargin}>{typeof right === 'function' ? right() : right}</View> : null}
      {chevron ? <RNText style={[styles.chevronIcon, { color: theme.colors.textMuted }]}>›</RNText> : null}
    </TouchableOpacity>
  );
};
export const ListItem = List.Item;

List.Icon = function ListIcon({ icon, color, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.listIcon, style]}>
      {typeof icon === 'function' ? (
        icon({ color: color || theme.colors.primary })
      ) : typeof icon === 'string' ? (
        <RNText style={[styles.listIconGlyph, { color: color || theme.colors.primary }]}>{icon}</RNText>
      ) : (
        icon
      )}
    </View>
  );
};

List.Accordion = function ListAccordion({
  title,
  description,
  left,
  right,
  expanded = false,
  onPress,
  children,
  style,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const theme = useTheme();
  const isOpen = onPress !== undefined ? expanded : internalOpen;

  const toggle = () => {
    if (onPress) {
      onPress();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggle}
        style={[
          styles.listItem,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        {left ? <View style={styles.itemLeftMargin}>{typeof left === 'function' ? left() : left}</View> : null}
        <View style={styles.itemContentFlex}>
          <RNText
            style={[
              styles.listItemTitle,
              { color: theme.colors.text, fontSize: theme.typography.sizes.base },
            ]}
          >
            {title}
          </RNText>
          {description ? (
            <RNText
              style={[
                styles.listItemDescription,
                { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
              ]}
            >
              {description}
            </RNText>
          ) : null}
        </View>
        {right ? (
          <View style={styles.itemRightMargin}>{right({ isExpanded: isOpen })}</View>
        ) : (
          <RNText style={[styles.accordionChevron, { color: theme.colors.textMuted }]}>
            {isOpen ? '▲' : '▼'}
          </RNText>
        )}
      </TouchableOpacity>
      {isOpen ? <View style={styles.accordionBody}>{children}</View> : null}
    </View>
  );
};

List.AccordionGroup = function ListAccordionGroup({ children }) {
  return <View>{children}</View>;
};

/**
 * DataTable / Table
 */
export const DataTable = function DataTableRoot({ children, style, ...props }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.dataTableBase,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: theme.radii.md,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
export const Table = DataTable;

DataTable.Header = function DataTableHeader({ children, style }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.dataTableRow,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

DataTable.Title = function DataTableTitle({ children, numeric = false, style, textStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.dataTableCell, numeric && { alignItems: 'flex-end' }, style]}>
      <RNText
        style={[
          styles.dataTableTitleText,
          { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
          textStyle,
        ]}
      >
        {children}
      </RNText>
    </View>
  );
};

DataTable.Row = function DataTableRow({ children, onPress, style }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.dataTableRow,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth || 1,
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

DataTable.Cell = function DataTableCell({ children, numeric = false, style, textStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.dataTableCell, numeric && { alignItems: 'flex-end' }, style]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <RNText
          style={[
            styles.dataTableCellText,
            { color: theme.colors.text, fontSize: theme.typography.sizes.sm },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
};

DataTable.Pagination = function DataTablePagination({
  page = 0,
  numberOfPages = 1,
  label,
  onPageChange,
  style,
}) {
  const theme = useTheme();
  return (
    <View style={[styles.dataTablePagination, style]}>
      <RNText style={[styles.paginationCount, { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs }]}>
        {label || `${page + 1} of ${numberOfPages}`}
      </RNText>
      <View style={styles.paginationControls}>
        <TouchableOpacity
          disabled={page <= 0}
          onPress={() => onPageChange && onPageChange(page - 1)}
          style={[styles.paginationBtn, { opacity: page <= 0 ? 0.3 : 1 }]}
        >
          <RNText style={[styles.paginationBtnText, { color: theme.colors.text }]}>◀</RNText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={page >= numberOfPages - 1}
          onPress={() => onPageChange && onPageChange(page + 1)}
          style={[styles.paginationBtn, { opacity: page >= numberOfPages - 1 ? 0.3 : 1 }]}
        >
          <RNText style={[styles.paginationBtnText, { color: theme.colors.text }]}>▶</RNText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listSectionTitle: {
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  listSubheader: {
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth || 1,
  },
  listItemTitle: {
    fontWeight: '500',
  },
  listItemDescription: {
    marginTop: 2,
  },
  listIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataTableBase: {
    overflow: 'hidden',
  },
  dataTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dataTableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  dataTableTitleText: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dataTableCellText: {},
  dataTablePagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemLeftMargin: {
    marginRight: 14,
  },
  itemContentFlex: {
    flex: 1,
    justifyContent: 'center',
  },
  itemRightMargin: {
    marginLeft: 14,
  },
  chevronIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  listIconGlyph: {
    fontSize: 20,
  },
  accordionChevron: {
    fontSize: 16,
  },
  accordionBody: {
    paddingLeft: 16,
  },
  paginationCount: {},
  paginationControls: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  paginationBtn: {
    padding: 6,
  },
  paginationBtnText: {},
});
