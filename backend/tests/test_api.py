import unittest
from flask_testing import TestCase
from app import create_app

class APITestCase(TestCase):

    def create_app(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        return self.app

    def setUp(self):
        self.client = self.app.test_client()

    # Standard tests
    def test_get_map(self):
        response = self.client.get('/api/map')
        self.assertEqual(response.status_code, 200)
        self.assertIn('map', response.json)

    # Comprehensive Tests for Nodes
    def test_add_node_with_existing_code(self):
        new_node = {"code": 10001000, "x": 100, "y": 100}
        response = self.client.post('/api/map/nodes', json=new_node)
        self.assertEqual(response.status_code, 400)

    def test_add_node_with_missing_parameters(self):
        new_node = {"code": 1}
        response = self.client.post('/api/map/nodes', json=new_node)
        self.assertEqual(response.status_code, 400)

    def test_update_node_with_missing_parameters(self):
        updated_node = {"code": 1}
        response = self.client.put('/api/map/nodes/1', json=updated_node)
        self.assertEqual(response.status_code, 404)

    def test_update_non_existent_node(self):
        updated_node = {"code": 1000, "x": 1100, "y": 1100}
        response = self.client.put('/api/map/nodes/1000', json=updated_node)
        self.assertEqual(response.status_code, 404)

    def test_delete_non_existent_node(self):
        response = self.client.delete('/api/map/nodes/1000')
        self.assertEqual(response.status_code, 404)

    # Integration Tests
    def test_add_update_and_delete_node(self):
        # Add node
        new_node = {"code": 2, "x": 200, "y": 200}
        response = self.client.post('/api/map/nodes', json=new_node)
        self.assertEqual(response.status_code, 201)

        # Update the node
        updated_node = {"code": 2, "x": 220, "y": 220}
        response = self.client.put('/api/map/nodes/2', json=updated_node)
        self.assertEqual(response.status_code, 200)

        # Delete the node
        response = self.client.delete('/api/map/nodes/2')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
