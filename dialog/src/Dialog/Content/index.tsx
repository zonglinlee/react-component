import * as React from 'react';
import { useRef } from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import { offset } from '../../util';
import type { PanelProps, ContentRef } from './Panel';
import Panel from './Panel';

export type ContentProps = {
  motionName: string;
  ariaId: string;
  onVisibleChanged: (visible: boolean) => void;
} & PanelProps;

const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const {
    prefixCls,
    title,
    style,
    className,
    visible,
    forceRender,
    destroyOnClose,
    motionName,
    ariaId,
    onVisibleChanged,
    mousePosition,
  } = props;

  const dialogRef = useRef<HTMLDivElement>();

  // ============================= Style ==============================
  const [transformOrigin, setTransformOrigin] = React.useState<string>();
  const contentStyle: React.CSSProperties = {};

  if (transformOrigin) {
    contentStyle.transformOrigin = transformOrigin;
  }

  function onPrepare() {
    const elementOffset = offset(dialogRef.current);

    setTransformOrigin(
      mousePosition
        ? `${mousePosition.x - elementOffset.left}px ${mousePosition.y - elementOffset.top}px`
        : '',
    );
  }

  // ============================= Render =============================
  return (
    <CSSMotion
      visible={visible}
      onVisibleChanged={onVisibleChanged}
      onAppearPrepare={onPrepare}
      onEnterPrepare={onPrepare}
      forceRender={forceRender}
      motionName={motionName}
      removeOnLeave={destroyOnClose}
      ref={dialogRef}
    >
      {({ className: motionClassName, style: motionStyle }, motionRef) => (
        // 外部传入的 contentRef ref 作为 forwardRef 设置在了 Panel 上面了
        // cssMotion 中 dialogRef ref 作为 forwardRef 以 holderRef 的 prop 方式传入了 Panel 之中
        <Panel
          {...props}
          ref={ref}
          title={title}
          ariaId={ariaId}
          prefixCls={prefixCls}
          holderRef={motionRef}
          style={{ ...motionStyle, ...style, ...contentStyle }}
          className={classNames(className, motionClassName)}
        />
      )}
    </CSSMotion>
  );
});

Content.displayName = 'Content';

export default Content;
