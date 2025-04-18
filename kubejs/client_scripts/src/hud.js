let RenderType
    = Java.loadClass("net.minecraft.client.renderer.RenderType")
let Axis
    = Java.loadClass("com.mojang.math.Axis");
let Tessellator =
    Java.loadClass("com.mojang.blaze3d.vertex.Tesselator");
let VertexFormat$Mode =
    Java.loadClass("com.mojang.blaze3d.vertex.VertexFormat$Mode");
let DefaultVertexFormat =
    Java.loadClass("com.mojang.blaze3d.vertex.DefaultVertexFormat");
let GLFW = Java.loadClass("org.lwjgl.glfw.GLFW");
let MoveUIConfig = Java.loadClass("org.anningui.moveui.Config")
let MoveUIKeys = Java.loadClass("org.anningui.moveui.MoveUIStone$MoveUIKeys")
// MoveUIStone.set(MoveUIKeys.TEXT_Y, 0)
// MoveUIStone.set(MoveUIKeys.TEXT_X, 0)
// console.log(`

//     MoveUIStone.get(MoveUIKeys.HOT_BAR_X): ${MoveUIStone.get(MoveUIKeys.TEXT_Y)}
//     MoveUIConfig.HOT_BAR_X: ${MoveUIConfig.HOT_BAR_Y.get()}
// `)

const $RenderGuiEvent$Pre = Java.loadClass("net.minecraftforge.client.event.RenderGuiEvent$Pre")

/**
 * @template T
 * @param {T} event 
 * @param {(event: InstanceType<T>) => void} handler 
 * @returns 
 */
const NOnEvent = (event, handler) => NativeEvents.onEvent(event, handler)

const $NativeEvents = {
    /**
     * @template T
     * @param {T} event 
     * @param {(event: InstanceType<T>) => void} handler 
     * @returns 
     */
    onEvent: (event, handler) => NativeEvents.onEvent(event, handler)
}


let NativeImage = Java.loadClass("com.mojang.blaze3d.platform.NativeImage")
/**
 * 
 * @param {ResourceLocation} path 
 */
const getImgSize = (path) => {
    try {
        let resource = Client.getResourceManager().getResource(path).get();
        let stream = resource.open();
        let img = NativeImage.read(stream)
        let width = img.getWidth();
        let height = img.getHeight();
        img.close();
        return { width: width, height: height }
    } catch (e) {
        return { width: 0, height: 0 }
    }
}


/**
 * 卡片类
 * @constructor
 * @param {number} distance - 卡片距离消失点的距离
 * @param {number} width - 卡片宽度
 * @param {number} height - 卡片高度
 * @param {number} color - 卡片颜色
 * @param {number} angle - 旋转角度
 * @param {{x: number, y: number}} vanishingPoint - 消失点坐标
 */
function Card(distance, width, height, color, angle, vanishingPoint, zIndex) {
    this.distance = distance;
    this.width = width;
    this.height = height;
    this.color = color;
    this.angle = angle;
    this.vanishingPoint = vanishingPoint;
    this.zIndex = zIndex;
}

/**
 * 获取卡片的位置
 * @returns {{x: number, y: number}} 卡片的屏幕坐标
 */
Card.prototype.getPosition = function () {
    let aR = this.angle * KMath.PI / 180;
    return {
        x: this.vanishingPoint.x + (JavaMath.sin(aR) * this.distance),
        y: this.vanishingPoint.y - (JavaMath.cos(aR) * this.distance)
    };
};

/**
 * 渲染卡片
 * @param {PoseStack} poseStack - 渲染的姿态栈
 * @param {GuiGraphics} guiGraphics - GUI 渲染对象
 * @param {ResourceLocation_} path - 卡片路径
 * @param { {width: number, height: number} } imgSize
 */
Card.prototype.render = function (poseStack, guiGraphics, path, imgSize) {
    let { x, y } = this.getPosition();
    // guiGraphics['drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)'](
    //     Client.font,
    //     this.angle.toString(),
    //     x, y,
    //     MJSRenderUtils.rgba255ToColor(255, 127, 127, 1),
    //     false
    // );
    this.renderOutline(poseStack, guiGraphics, x, y, path, imgSize);
    let pos = this.getPosition()
    const vertexMap = this.getVertexByRect()
    let lt = vertexMap.leftTop
    let rt = vertexMap.rightTop
    let lb = vertexMap.leftBottom
    let rb = vertexMap.rightBottom
    let dotColor = MJSRenderUtils.rgba255ToColor(127, 127, 255, 1)
    renderDot(
        pos.x,
        pos.y,
        dotColor,
        guiGraphics
    )

    // renderDot(
    //     lt.x,
    //     lt.y,
    //     dotColor,
    //     guiGraphics
    // )
    // renderDot(
    //     rt.x,
    //     rt.y,
    //     dotColor,
    //     guiGraphics
    // )
    // renderDot(
    //     lb.x,
    //     lb.y,
    //     dotColor,
    //     guiGraphics
    // )
    // renderDot(
    //     rb.x,
    //     rb.y,
    //     dotColor,
    //     guiGraphics
    // )
};



/**
 * 渲染卡片轮廓
 * @param {PoseStack} poseStack - 渲染的姿态栈
 * @param {GuiGraphics} guiGraphics - GUI 渲染对象
 * @param {number} x - 卡片的 x 坐标
 * @param {number} y - 卡片的 y 坐标
 * @param {ResourceLocation_} path - 卡片路径
 * @param { {width: number, height: number} } imgSize
 */
Card.prototype.renderOutline = function (poseStack, guiGraphics, x, y, path, imgSize) {
    poseStack.pushPose();
    poseStack.translate(x, y, 0);
    poseStack.rotateZ(this.angle);
    guiGraphics.renderOutline(
        -this.width / 2, -this.height / 2,
        this.width, this.height,
        this.color
    );
    if (this.zIndex < 8) {
        guiGraphics.blit(
            path, -this.width / 2, -this.height / 2,
            0, 0, 0, imgSize.width, imgSize.height,
            imgSize.width, imgSize.height,
        )
    }
    poseStack.popPose();
};

Card.prototype.getVertexByRect = function () {
    let { sin, cos } = JavaMath;
    let { x, y } = this.getPosition();
    // 顶点偏移量的旋转逻辑保持不变 
    const rotate = (offsetX, offsetY) => ({
        x: x + offsetX * cos(this.angle / 180 * KMath.PI) - offsetY * sin(this.angle / 180 * KMath.PI),
        y: y + offsetX * sin(this.angle / 180 * KMath.PI) + offsetY * cos(this.angle / 180 * KMath.PI)
    });

    const halfW = this.width / 2, halfH = this.height / 2;
    return {
        leftTop: rotate(-halfW, -halfH),
        rightTop: rotate(halfW, -halfH),
        leftBottom: rotate(-halfW, halfH),
        rightBottom: rotate(halfW, halfH)
    };
}

Card.prototype.upDate = function (distance) {
    this.distance = distance;
}

Card.prototype.up = function (upNum) {
    this.upDate(this.distance + upNum);
}



$NativeEvents.onEvent($RenderGuiEvent$Pre, (e) => {
    let { guiGraphics } = e;
    let poseStack = guiGraphics.pose();
    let path = new ResourceLocation("arc:textures/gui/test_card.png")
    let imgSize = getImgSize(path)
    // Client.player.tell(s)
    let vanishingPoint = {
        x: guiGraphics.guiWidth() / 2,
        y: guiGraphics.guiHeight() * (5 / 4)
    };

    let distance = 4 * guiGraphics.guiHeight() / 9;

    // guiGraphics.blit(
    //     path, 0, 0,
    //     0, 0, 0, imgSize.width, imgSize.height,
    //     imgSize.width, imgSize.height,
    // )
    let cards = [];
    for (let i = -4; i < 5; i++) {
        cards.push(new Card(
            distance,
            imgSize.width, imgSize.height,
            MJSRenderUtils.rgba255ToColor(255, 127, 127, 1),
            i * 12.2,
            vanishingPoint,
            i + 4
        ));
    }
    for (let keyNumber = 1; keyNumber <= 9; keyNumber++) {
        let keyCode = GLFW[`GLFW_KEY_${keyNumber}`];
        if (Client.isKeyDown(keyCode)) {
            cards[keyNumber - 1].up(20);
            break;
        }
    }

    cards.forEach(card => {
        card.render(poseStack, guiGraphics, path, imgSize)
    });
});


/**
 * 计算一个矩形的四个顶点坐标，该矩形的中心点围绕 vanishingPoint 旋转，并且矩形本身也旋转
 * @param { {x: number, y: number} } cPos 矩形中心点
 * @param {number} w 矩形宽度
 * @param {number} h 矩形高度
 * @param {number} angle 旋转角度（弧度制）
 * @returns { {leftTop: {x: number, y: number}, rightTop: {x: number, y: number}, leftBottom: {x: number, y: number}, rightBottom: {x: number, y: number} } }
 */
function getVertexByRect(cPos, w, h, angle) {
    let { sin, cos } = JavaMath;
    // 顶点偏移量的旋转逻辑保持不变 
    const rotate = (offsetX, offsetY) => ({
        x: cPos.x + offsetX * cos(angle / 180 * KMath.PI) - offsetY * sin(angle / 180 * KMath.PI),
        y: cPos.y + offsetX * sin(angle / 180 * KMath.PI) + offsetY * cos(angle / 180 * KMath.PI)
    });

    const halfW = w / 2, halfH = h / 2;
    return {
        leftTop: rotate(-halfW, -halfH),
        rightTop: rotate(halfW, -halfH),
        leftBottom: rotate(-halfW, halfH),
        rightBottom: rotate(halfW, halfH)
    };
}



/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} color 
 * @param {GuiGraphics} guiGraphics - GUI 渲染对象
 */
function renderDot(x, y, color, guiGraphics) {
    // Client.player.tell(`${Number.isFinite(x)} - ${Number.isFinite(y)}`)
    if (Number.isFinite(x) && Number.isFinite(y)) {
        // Client.player.tell(`${x} - ${y}`)
        guiGraphics.fill(
            x - 1.5,
            y - 1.5,
            x + 1.5,
            y + 1.5,
            color
        )
    }
}

/**!SECTION
X_T + cos(a) * d_lt = X
Y_T + sin(a) * d_lt = Y

X_T = X - cos(a) * d_lt
Y_T = Y - sin(a) * d_lt
 */

