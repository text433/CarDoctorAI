using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 4.5f;
    private Rigidbody2D body;
    private Vector2 move;

    private void Awake() => body = GetComponent<Rigidbody2D>();

    private void Update()
    {
        move = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")).normalized;
    }

    private void FixedUpdate()
    {
        body.MovePosition(body.position + move * moveSpeed * Time.fixedDeltaTime);
    }

    public void SetMobileInput(Vector2 direction) => move = Vector2.ClampMagnitude(direction, 1f);
}
