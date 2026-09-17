import tempfile
import unittest
from pathlib import Path

from server import ConflictError, NotFoundError, SyncStore, validate_payload


class SyncStoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.store = SyncStore(Path(self.temp.name) / "sync.sqlite3")

    def tearDown(self):
        self.temp.cleanup()

    def test_create_read_update_and_conflict(self):
        payload = {"iv": "AAAAAAAAAAAAAAAA", "ciphertext": "encrypted_value"}
        self.assertEqual(self.store.put("Abcdefghijkl", "a" * 43, 0, payload), 1)
        self.assertEqual(self.store.get("Abcdefghijkl", "a" * 43)["ciphertext"], "encrypted_value")
        self.assertEqual(self.store.put("Abcdefghijkl", "a" * 43, 1, payload), 2)
        with self.assertRaises(ConflictError):
            self.store.put("Abcdefghijkl", "a" * 43, 1, payload)

    def test_wrong_token_does_not_reveal_space(self):
        payload = {"iv": "AAAAAAAAAAAAAAAA", "ciphertext": "encrypted_value"}
        self.store.put("Abcdefghijkl", "a" * 43, 0, payload)
        with self.assertRaises(NotFoundError):
            self.store.get("Abcdefghijkl", "b" * 43)

    def test_encrypted_payload_validation(self):
        self.assertEqual(validate_payload({"iv": "AAAAAAAAAAAAAAAA", "ciphertext": "abc_123-XYZ"})["iv"], "AAAAAAAAAAAAAAAA")
        with self.assertRaises(ValueError):
            validate_payload({"iv": "short", "ciphertext": "abc"})


if __name__ == "__main__":
    unittest.main()
