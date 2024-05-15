type DisposableSubscription = () => Promise<void> | void;
declare class Disposable {
    protected subscriptions: Array<DisposableSubscription>;
    dispose(): Promise<void>;
}

export { Disposable, type DisposableSubscription };
