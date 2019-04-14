import Dialog, { DialogNode, DialogStep } from './Dialog';

type FramePosition = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type DialogEventType = 'end';

export default class DialogPlugin extends Phaser.Plugins.ScenePlugin {
    private isVisible: boolean = false;
    private lineHeight = 20;
    private borderWidth = 10;
    private framePadding = 5;
    private framePosition: FramePosition;
    private textRenderingSpeed = 100;
    private graphics: Phaser.GameObjects.Graphics;
    private line: Phaser.GameObjects.Text;
    private options: Phaser.GameObjects.Text[] = [];
    private textRenderingEvent: Phaser.Time.TimerEvent;
    private dialog: Dialog;
    private eventEmitter: Phaser.Events.EventEmitter;

    constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager);

        this.eventEmitter = new Phaser.Events.EventEmitter();
        //  Register our new Game Object type
        pluginManager.registerGameObject('dialog', this.start);
    }

    private initInput() {
        const keyNames = [
            Phaser.Input.Keyboard.KeyCodes.ONE,
            Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE,
            Phaser.Input.Keyboard.KeyCodes.FOUR,
            Phaser.Input.Keyboard.KeyCodes.FIVE,
            Phaser.Input.Keyboard.KeyCodes.SIX,
            Phaser.Input.Keyboard.KeyCodes.SEVEN,
            Phaser.Input.Keyboard.KeyCodes.EIGHT,
            Phaser.Input.Keyboard.KeyCodes.NINE,
        ];
        this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            const nodeIdx = keyNames.indexOf(event.keyCode);
            if (nodeIdx == -1) {
                return;
            }
            const nextNode = this.dialog.currentStep.nextNodes[nodeIdx];
            if (nextNode) {
                const newStep = this.dialog.answer(nextNode.id);
                if (newStep) {
                    this.renderStep(newStep);
                }
            } else {
                this.close();
            }
        });
    }

    private getFramePosition() {
        return {
            x: this.borderWidth,
            y: this.scene.cameras.main.height - (this.scene.cameras.main.height * 0.3) - this.borderWidth,
            width: this.scene.cameras.main.width - this.borderWidth * 2,
            height: this.scene.cameras.main.height * 0.3
        };
    }

    private renderLine(text: string) {
        if (this.line) {
            this.line.destroy();
            this.textRenderingEvent.destroy();
        }
        this.line = this.scene.make.text({
            x: this.framePosition.x,
            y: this.framePosition.y,
            text: '',
            style: {
                fixedHeight: 20
            }
        });
        this.line.setPadding(this.framePadding, this.framePadding, this.framePadding, this.framePadding);
        this.line.setFixedSize(this.framePosition.width - 40, 40);
        this.line.setWordWrapWidth(this.framePosition.width - 20);
        let eventCounter = 0;
        this.textRenderingEvent = this.scene.time.addEvent({
            delay: 150 - (this.textRenderingSpeed * 30),
            callback: () => {
                eventCounter++;
                if (text) {
                    this.line.setText(this.line.text + text[eventCounter - 1]);
                }
                if (eventCounter === text.length) {
                    this.textRenderingEvent.destroy();
                    this.onLineRenderingEnd();
                }
            },
            callbackScope: this,
            loop: true
          });
    }

    private onLineRenderingEnd() {
        this.renderOptions(this.dialog.currentStep.nextNodes);
    }

    private renderOptions(nextNodes: DialogNode[]) {
        for (const option of this.options) {
            option.destroy();
        }
        if (nextNodes.length === 0){
            const option = this.scene.make.text({
                x: this.framePosition.x,
                y: this.framePosition.y + 170,
                text: `${1}. (Leave)`,
                style: {
                    fixedWidth: this.scene.cameras.main.width - 40
                }
            });
            option.setPadding(this.framePadding, this.framePadding, this.framePadding, this.framePadding);
            this.options.push(option);
        }
        for (let i = nextNodes.length - 1; i >= 0; --i) {
            const option = this.scene.make.text({
                x: this.framePosition.x,
                y: this.framePosition.y + 170 - (nextNodes.length - i - 1) * this.lineHeight,
                text: `${i + 1}. ${nextNodes[i].playerAnswer}`,
                style: {
                    fixedWidth: this.scene.cameras.main.width - 40
                }
            });
            option.setPadding(this.framePadding, this.framePadding, this.framePadding, this.framePadding);
            this.options.push(option);
        }
    }

    private renderFrame() {
        const rect = new Phaser.Geom.Rectangle(this.framePosition.x, this.framePosition.y, this.framePosition.width, this.framePosition.height);
        this.graphics = this.scene.add.graphics()
        this.graphics.lineStyle(this.borderWidth, 0x6e4c19, 1);
        this.graphics.strokeRectShape(rect);
        this.graphics.fillStyle(0x473110, 1);
        this.graphics.fillRectShape(rect);
    }

    private renderStep(step: DialogStep) {
        this.framePosition = this.getFramePosition();
        this.renderFrame();
        this.renderLine(step.currentNode.line || "");
    }

    private close() {
        if (this.isVisible === false) {
            return;
        }
        this.isVisible = false;
        this.graphics.visible = this.isVisible;
        this.eventEmitter.emit('end');
    }

    public open(dialog: Dialog) {
        if (this.isVisible) {
            return;
        }
        this.isVisible = true;
        this.dialog = dialog;
        this.renderStep(dialog.start());
        this.initInput();
    }

    public on(eventType: DialogEventType, cb: () => void) {
        this.eventEmitter.on(eventType, cb);
    }
}