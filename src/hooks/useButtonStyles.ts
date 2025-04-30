import { createStyles } from "antd-style";

export const useButtonStyles = () => {
  return createStyles(({ prefixCls, css }) => ({
    // Button Gradient Green (Add)
    gradientButtonGreen: css`
      &.${prefixCls}-btn-primary:not([disabled]) {
        > span {
          position: relative;
          color: #ffffff;
          font-weight: 600;
          transition: color 0.3s, background-color 0.3s;
        }
        &::before {
          content: "";
          background: linear-gradient(135deg, #00b09b, #96c93d); /* xanh lá gradient đẹp */
          position: absolute;
          inset: -1px;
          opacity: 1;
          border-radius: inherit;
          transition: all 0.3s;
          z-index: 0;
        }
        position: relative;
        overflow: hidden;
        z-index: 1;
        &:hover::before {
          opacity: 0;
        }
        &:hover > span {
          color: #00b09b;
        }
        &:hover {
          background: #ffffff;
          border-color: #00b09b;
        }
      }
    `,

    // Button Gradient Blue (Edit)
    gradientButtonBlue: css`
      &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
        > span {
          position: relative;
          color: #ffffff;
          font-weight: 600;
          transition: color 0.3s, background-color 0.3s;
        }
        &::before {
          content: "";
          background: linear-gradient(135deg, #396afc, #2948ff); /* xanh biển đậm đẹp */
          position: absolute;
          inset: -1px;
          opacity: 1;
          border-radius: inherit;
          transition: all 0.3s;
          z-index: 0;
        }
        position: relative;
        overflow: hidden;
        z-index: 1;
        &:hover::before {
          opacity: 0;
        }
        &:hover > span {
          color: #396afc;
        }
        &:hover {
          background: #ffffff;
          border-color: #396afc;
        }
      }
    `,

    // Button Gradient Red (Delete)
    gradientButtonRed: css`
      &.${prefixCls}-btn-dangerous:not([disabled]) {
        > span {
          position: relative;
          color: #ffffff;
          font-weight: 600;
          transition: color 0.3s;
        }
        &::before {
          content: "";
          background: linear-gradient(135deg, #ff512f, #dd2476); /* đỏ hồng tím đẹp */
          position: absolute;
          inset: -1px;
          opacity: 1;
          border-radius: inherit;
          transition: all 0.3s;
          z-index: 0;
        }
        position: relative;
        overflow: hidden;
        z-index: 1;
        &:hover::before {
          opacity: 0;
        }
        &:hover > span {
          color: #dd2476;
        }
        &:hover {
          background: #ffffff;
          border-color: #dd2476;
        }
      }
    `,
  }))();
};
