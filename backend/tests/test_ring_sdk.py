import pytest

from app.ring_sdk import load_ring_sdk


def test_unknown_sdk_name_is_rejected():
    with pytest.raises(ValueError):
        load_ring_sdk("not-a-sdk")
