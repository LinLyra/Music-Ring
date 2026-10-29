# Vendor notes

Runtime helper modules for optional local gesture recognition may live here.

**Not published in this public Music-Ring repo:**

- recorded IMU gesture JSON (`gestures/`, `gestures-方向/`)
- trained HMM pickles (`models/`, `models-方向/`)
- the older private `ring_sound_SDK/`
- the separate `../hmm_gesture/` train/record suite

Use the public [OpenZilo](https://github.com/ziloai/openzilo) package for device I/O. Re-add private models only in a local clone if you have permission from the people who trained them.
