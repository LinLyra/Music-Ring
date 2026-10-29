"""Load the ring device SDK.

The public path is the OpenZilo package (https://github.com/ziloai/openzilo).
Existing call sites still use the older names ``RingSoundClient`` and
``RingSoundError``; this module aliases them onto the OpenZilo types.

Set ``ring.sdk`` to ``legacy`` (or ``RING_SDK=legacy``) to use the vendored
``ring_sound`` module instead. That path is for earlier firmware that was
already integrated in this repo. It is not a second product API.
"""

from __future__ import annotations

import sys
from pathlib import Path
from types import ModuleType

VENDOR_DIR = Path(__file__).resolve().parent.parent / "vendor"
SDK_OPENZILO = "openzilo"
SDK_LEGACY = "legacy"


def load_ring_sdk(prefer: str = SDK_OPENZILO) -> ModuleType:
    name = (prefer or SDK_OPENZILO).strip().lower()
    if name == SDK_LEGACY:
        return _load_legacy()
    if name != SDK_OPENZILO:
        raise ValueError(
            f'Unknown ring SDK "{prefer}". Use "{SDK_OPENZILO}" or "{SDK_LEGACY}".'
        )
    try:
        import openzilo as sdk
    except ImportError as exc:
        raise RuntimeError(
            "The OpenZilo SDK is not installed. From backend/, run "
            "`uv add git+https://github.com/ziloai/openzilo`, "
            'or set ring.sdk to "legacy" to use vendor/ring_sound_SDK.'
        ) from exc
    if not hasattr(sdk, "RingSoundClient"):
        sdk.RingSoundClient = sdk.OpenZiloClient  # type: ignore[attr-defined]
    if not hasattr(sdk, "RingSoundError"):
        sdk.RingSoundError = sdk.OpenZiloError  # type: ignore[attr-defined]
    return sdk


def _load_legacy() -> ModuleType:
    for path in (str(VENDOR_DIR), str(VENDOR_DIR / "ring_sound_SDK")):
        if path not in sys.path:
            sys.path.insert(0, path)
    import ring_sound as sdk  # type: ignore

    return sdk
