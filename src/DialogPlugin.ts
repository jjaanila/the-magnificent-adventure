import Dialog, { DialogNode } from './Dialog';

type FramePosition = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export default class DialogPlugin extends Phaser.Plugins.ScenePlugin {
    private borderWidth = 10;
    private framePadding = 5;
    private textRenderingSpeed = 2;
    private graphics: Phaser.GameObjects.Graphics;
    private line: Phaser.GameObjects.Text;
    private options: Phaser.GameObjects.Text[] = [];
    private textRenderingEvent: Phaser.Time.TimerEvent;
    private dialog: Dialog;

    constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('dialog', this.start);
    }

    private getFramePosition() {
        return {
            x: this.borderWidth,
            y: this.scene.cameras.main.height - (this.scene.cameras.main.height * 0.3) - this.borderWidth,
            width: this.scene.cameras.main.width - this.borderWidth * 2,
            height: this.scene.cameras.main.height * 0.3
        };
    }

    private renderLine(text: string, {x, y}: FramePosition) {
        if (this.line) {
            this.line.destroy();
        }
        
        this.line = this.scene.make.text({
            x,
            y,
            text: ''
        });
        this.line.setPadding(this.framePadding, this.framePadding, this.framePadding, this.framePadding);
        let eventCounter = 0;
        this.textRenderingEvent = this.scene.time.addEvent({
            delay: 150 - (this.textRenderingSpeed * 30),
            callback: () => {
                eventCounter++;
                this.line.setText(this.line.text + text[eventCounter - 1]);
                if (eventCounter === text.length) {
                    this.textRenderingEvent.remove(() => {});
                }
            },
            callbackScope: this,
            loop: true
          });
    }

    private renderOptions(nextNodes: DialogNode[], {x, y}: FramePosition) {
        for (const node of nextNodes) {
            const option = this.scene.make.text({
                x,
                y: y + 40,
                text: node.playerAnswer
            });
            option.setPadding(this.framePadding, this.framePadding, this.framePadding, this.framePadding);
            this.options.push(option);
        }
    }

    private renderFrame({x, y, width, height}: FramePosition) {
        const rect = new Phaser.Geom.Rectangle(x, y, width, height);
        this.graphics = this.scene.add.graphics()
        this.graphics.lineStyle(this.borderWidth, 0x6e4c19, 1);
        this.graphics.strokeRectShape(rect);
        this.graphics.fillStyle(0x473110, 1);
        this.graphics.fillRectShape(rect);
    }

    public close() {
        this.graphics.visible = false;
    }

    run(dialog: Dialog) {
        this.dialog = dialog;
        const pos = this.getFramePosition();
        this.renderFrame(pos);
        const currentStep = dialog.start();
        this.renderLine(currentStep.currentNode.line || "", pos);
        this.renderOptions(currentStep.nextNodes, pos);
    }
}