<template>
  <canvas
    id="canvas"
    ref="canvas"
    class="canvas"
    :width="props.width"
    :height="props.height"
  ></canvas>
  <div class="qrcode" :style="{ width: props.width + 'px' }">
    <el-input
      type="text"
      :change="debounceHandlerQrcode(props.qrParams)"
      v-model="props.qrParams"
      placeholder="请输入桌号"
      :formatter="(e) => e"
      :parser="
        (va) => {
          const value = parseInt(va);
          if (isNaN(value)) {
            return '0';
          } else if (value <= 0 || value > 50) {
            return '0';
          } else {
            return value.toString();
          }
        }
      "
    />
    <div
      @click="savePic"
      style="
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <span>下载二维码</span>
      <el-icon>
        <Download />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import { ref, reactive, defineProps, inject } from "vue";
import base from "@/network/base";
import { useDebounce } from "@/hooks/debounce";
const codeConfig = defineProps(["config"]);
const props = reactive({
  //二维码存储内容
  qrUrl: codeConfig.config.qrUrl || base.frontendUrl,
  //
  qrParams: codeConfig.config.qrParams || 1,
  // canvas width
  width: codeConfig.config.width || 360,
  // canvas height
  height: codeConfig.config.height || 360,
  // 二维码尺寸（正方形 长宽相同）
  qrSize: codeConfig.config.qrSize || 360,
  // 二维码底部文字
  qrText: codeConfig.config.qrText || "桌号",
  //底部说明文字字号
  qrTextSize: codeConfig.config.qrTextSize || 24,
});
const qrCodeOption = {
  errorCorrectionLevel: "H",
  width: props.qrSize,
} as QRCodeToDataURLOptions;

const canvas = ref<HTMLCanvasElement>();
const loading = inject("loading") as any;
const elMessage = inject("elMessage") as any;
/**
 * @argument qrUrl        二维码内容
 * @argument qrSize       二维码大小
 * @argument qrText       二维码中间显示文字
 * @argument qrTextSize   二维码中间显示文字大小(默认16px)
 */
const handleQrcode = async (qrParams: number): Promise<void> => {
  if (!(qrParams && canvas.value)) {
    return;
  }
  let dom = canvas.value as HTMLCanvasElement;
  try {
    const url = await QRCode.toDataURL(props.qrUrl + qrParams, qrCodeOption);
    console.log(url);

    // 画二维码里的logo// 在canvas里进行拼接
    const ctx = dom.getContext("2d") as CanvasRenderingContext2D;
    const image = new Image();
    image.src = url;

    image.onload = () => {
      ctx.drawImage(
        image,
        (props.width - props.qrSize) / 2,
        0,
        props.qrSize,
        props.qrSize
      );
      if (props.qrText) {
        //设置字体
        ctx.font = "bold " + props.qrTextSize + "px Arial";
        let tw = ctx.measureText(props.qrText + props.qrParams).width; // 文字真实宽度
        let ftop = props.qrSize - props.qrTextSize; // 根据字体大小计算文字top
        let fleft = (props.width - tw) / 2; // 根据字体大小计算文字left
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "top"; //设置绘制文本时的文本基线。
        ctx.fillStyle = "#333";
        ctx.fillText(props.qrText + props.qrParams, fleft, ftop);
      }
    };
  } catch (err) {
    console.log(err);
    elMessage("二维码更新失败");
  }
};
const debounceHandlerQrcode = useDebounce(handleQrcode);
//保存图片
const savePic = () => {
  if (props.qrParams < 1) {
    return elMessage("请输入大于1的正常桌号");
  }
  let dom = canvas.value as HTMLCanvasElement;
  let a = document.createElement("a");
  //将二维码面板处理为图片
  a.href = dom.toDataURL("image/png", 0.5);
  a.download = props.qrParams + ".png";
  a.click();
};
</script>

<style lang="scss" scoped>
.canvas {
  margin: 0 auto;
}

.qrcode {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
