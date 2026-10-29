namespace Nhaxuong.SERVICE.DTOs.Response
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static ApiResponse<T> Ok(T data, string? message = null)
        {
            return new ApiResponse<T> { Success = true, Data = data, Message = message };
        }

        public static ApiResponse<T> Fail(string message)
        {
            return new ApiResponse<T> { Success = false, Message = message };
        }
    }

    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = [];
        public int Total { get; set; }
        public int TotalCount { get => Total; set => Total = value; }
        public int Page { get; set; }
        public int PageNumber { get => Page; set => Page = value; }
        public int PageSize { get; set; }
        public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)Total / PageSize) : 0;
    }
}
